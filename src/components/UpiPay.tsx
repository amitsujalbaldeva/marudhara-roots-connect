import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Copy, IndianRupee } from "lucide-react";

/**
 * UPI payment card. Shows the QR immediately (works even when app links are
 * blocked inside an embedded preview) and offers direct GPay / PhonePe / Paytm
 * links plus a copy-to-clipboard fallback.
 */
export function UpiPay({
  upiId,
  payeeName,
  amount: fixedAmount,
  note,
}: {
  upiId: string;
  payeeName: string;
  amount?: number;
  note?: string;
}) {
  const [amount, setAmount] = useState(fixedAmount ? String(fixedAmount) : "");
  const [qr, setQr] = useState<string | null>(null);

  const query = useMemo(() => {
    const amt = Number(amount);
    const parts = [
      `pa=${encodeURIComponent(upiId)}`,
      `pn=${encodeURIComponent(payeeName)}`,
      "cu=INR",
    ];
    if (amt > 0) parts.push(`am=${amt}`);
    if (note) parts.push(`tn=${encodeURIComponent(note)}`);
    return parts.join("&");
  }, [upiId, payeeName, amount, note]);

  const link = `upi://pay?${query}`;

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(link, { margin: 1, width: 360 })
      .then((url) => alive && setQr(url))
      .catch(() => alive && setQr(null));
    return () => {
      alive = false;
    };
  }, [link]);

  const open = (scheme: string, label: string) => {
    const url = `${scheme}?${query}`;
    let opened = false;
    try {
      const w = window.open(url, "_blank");
      opened = !!w;
    } catch {
      opened = false;
    }
    if (!opened) {
      try {
        const a = document.createElement("a");
        a.href = url;
        a.rel = "noreferrer";
        a.click();
        opened = true;
      } catch {
        opened = false;
      }
    }
    setTimeout(() => {
      toast.info(
        `${label} न खुले तो नीचे QR स्कैन करें या UPI ID कॉपी कर के ऐप में पेस्ट करें।`,
      );
    }, 1500);
  };

  const apps: { label: string; scheme: string }[] = [
    { label: "Google Pay", scheme: "tez://upi/pay" },
    { label: "PhonePe", scheme: "phonepe://pay" },
    { label: "Paytm", scheme: "paytmmp://pay" },
    { label: "कोई भी UPI ऐप", scheme: "upi://pay" },
  ];

  return (
    <div className="surface grid gap-3 p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal">
        <IndianRupee className="h-4 w-4" /> ऑनलाइन भुगतान / Pay online
      </p>
      <p className="text-sm">
        UPI: <span className="font-bold">{upiId}</span>
        <span className="block text-xs text-muted-foreground">{payeeName}</span>
      </p>

      {fixedAmount ? (
        <p className="font-display text-2xl text-primary">₹{fixedAmount.toLocaleString("en-IN")}</p>
      ) : (
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
          inputMode="numeric"
          placeholder="राशि ₹ / Amount"
          className="h-12 w-full rounded-2xl border border-border bg-card px-3 text-base"
        />
      )}

      {qr ? (
        <div className="grid justify-items-center gap-1">
          <img src={qr} alt="UPI QR" className="h-44 w-44 rounded-2xl bg-white p-2" />
          <span className="text-center text-[11px] text-muted-foreground">
            सबसे आसान तरीका: किसी भी UPI ऐप से यह QR स्कैन करें
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        {apps.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => open(a.scheme, a.label)}
            className="tap btn-outline h-12 text-xs"
          >
            {a.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(upiId);
            toast.success("UPI ID कॉपी हो गई / Copied");
          } catch {
            toast.error("कॉपी नहीं हुआ — UPI ID हाथ से लिखें");
          }
        }}
        className="tap btn-outline w-full text-sm"
      >
        <Copy className="h-4 w-4" /> UPI ID कॉपी करें
      </button>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        पैसा सीधे कारीगर के खाते में जाता है। भेजने से पहले नाम ज़रूर देखें।
      </p>
    </div>
  );
}
