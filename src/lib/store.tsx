import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  homestays as seedHomestays,
  producers as seedProducers,
  products as seedProducts,
  villages as seedVillages,
  type Status,
} from "./data";

export type Role = "tourist" | "producer" | "admin";
export type OrderStatus = "pending" | "shipped" | "completed";

export type CartLine = { productId: string; qty: number };

export type Order = {
  id: string;
  lines: CartLine[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  buyer: string;
};

export type Booking = {
  id: string;
  kind: "homestay" | "experience";
  refId: string;
  date: string;
  guests: number;
  total: number;
  placedAt: string;
};

export type Listing = {
  id: string;
  type: "village" | "producer" | "homestay" | "product";
  label: string;
  sub: string;
  status: Status;
};

export type Approvals = Record<string, Status>;

type State = {
  role: Role;
  setRole: (r: Role) => void;
  cart: CartLine[];
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  follows: string[];
  toggleFollow: (producerId: string) => void;
  isFollowing: (producerId: string) => boolean;
  orders: Order[];
  placeOrder: (lines: CartLine[], total: number) => Order;
  advanceOrder: (id: string) => void;
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "placedAt">) => Booking;
  approvals: Approvals;
  setApproval: (key: string, status: Status) => void;
  commission: { product: number; homestay: number; experience: number };
  setCommission: (c: { product: number; homestay: number; experience: number }) => void;
  pendingQueue: Listing[];
};

const Ctx = createContext<State | null>(null);
const KEY = "marudhara.state.v1";

const seedOrders: Order[] = [
  {
    id: "1258",
    lines: [{ productId: "p1", qty: 2 }],
    total: 360,
    status: "pending",
    placedAt: "2026-08-28",
    buyer: "Aarav Mehta",
  },
  {
    id: "1257",
    lines: [{ productId: "p3", qty: 1 }],
    total: 240,
    status: "shipped",
    placedAt: "2026-08-24",
    buyer: "Nisha Rao",
  },
  {
    id: "1256",
    lines: [
      { productId: "p5", qty: 1 },
      { productId: "p2", qty: 1 },
    ],
    total: 2070,
    status: "completed",
    placedAt: "2026-08-12",
    buyer: "Rahul Sen",
  },
];

const seedBookings: Booking[] = [
  {
    id: "B-3021",
    kind: "homestay",
    refId: "h1",
    date: "2026-09-18",
    guests: 2,
    total: 2800,
    placedAt: "2026-08-27",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("tourist");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [follows, setFollows] = useState<string[]>(["kamla"]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [approvals, setApprovals] = useState<Approvals>({});
  const [commission, setCommission] = useState({ product: 8, homestay: 12, experience: 10 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.role) setRole(s.role);
        if (s.cart) setCart(s.cart);
        if (s.follows) setFollows(s.follows);
        if (s.orders) setOrders(s.orders);
        if (s.bookings) setBookings(s.bookings);
        if (s.approvals) setApprovals(s.approvals);
        if (s.commission) setCommission(s.commission);
      }
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      KEY,
      JSON.stringify({ role, cart, follows, orders, bookings, approvals, commission }),
    );
  }, [hydrated, role, cart, follows, orders, bookings, approvals, commission]);

  const pendingQueue = useMemo<Listing[]>(() => {
    const items: Listing[] = [
      ...seedVillages
        .filter((v) => v.status === "pending")
        .map<Listing>((v) => ({
          id: `village:${v.id}`,
          type: "village",
          label: v.name.hi,
          sub: v.name.en,
          status: "pending",
        })),
      ...seedProducers
        .filter((p) => p.status === "pending")
        .map<Listing>((p) => ({
          id: `producer:${p.id}`,
          type: "producer",
          label: p.name.hi,
          sub: p.craft.en,
          status: "pending",
        })),
      ...seedHomestays
        .filter((h) => h.status === "pending")
        .map<Listing>((h) => ({
          id: `homestay:${h.id}`,
          type: "homestay",
          label: h.name.hi,
          sub: h.name.en,
          status: "pending",
        })),
      ...seedProducts
        .filter((p) => p.status === "pending")
        .map<Listing>((p) => ({
          id: `product:${p.id}`,
          type: "product",
          label: p.name.hi,
          sub: `₹${p.price} · ${p.name.en}`,
          status: "pending",
        })),
    ];
    return items.map((i) => ({ ...i, status: approvals[i.id] ?? "pending" }));
  }, [approvals]);

  const value: State = {
    role,
    setRole,
    cart,
    addToCart: (productId, qty = 1) =>
      setCart((c) => {
        const found = c.find((l) => l.productId === productId);
        if (found) return c.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l));
        return [...c, { productId, qty }];
      }),
    setQty: (productId, qty) =>
      setCart((c) =>
        qty <= 0
          ? c.filter((l) => l.productId !== productId)
          : c.map((l) => (l.productId === productId ? { ...l, qty } : l)),
      ),
    clearCart: () => setCart([]),
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
    follows,
    toggleFollow: (id) =>
      setFollows((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    isFollowing: (id) => follows.includes(id),
    orders,
    placeOrder: (lines, total) => {
      const order: Order = {
        id: String(1259 + orders.length),
        lines,
        total,
        status: "pending",
        placedAt: new Date().toISOString().slice(0, 10),
        buyer: "You",
      };
      setOrders((o) => [order, ...o]);
      return order;
    },
    advanceOrder: (id) =>
      setOrders((o) =>
        o.map((x) =>
          x.id === id
            ? { ...x, status: x.status === "pending" ? "shipped" : "completed" }
            : x,
        ),
      ),
    bookings,
    addBooking: (b) => {
      const booking: Booking = {
        ...b,
        id: `B-${3022 + bookings.length}`,
        placedAt: new Date().toISOString().slice(0, 10),
      };
      setBookings((x) => [booking, ...x]);
      return booking;
    },
    approvals,
    setApproval: (key, status) => setApprovals((a) => ({ ...a, [key]: status })),
    commission,
    setCommission,
    pendingQueue,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
