import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Screen, TopBar } from "@/components/AppShell";
import { ProductCard } from "@/components/cards";
import { getProducer, getProduct, getVillage, products } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { name: product.name.en, story: product.story.en };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — MARUDHARA" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — MARUDHARA`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.story },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.story },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const { t } = useLang();
  const L = useLocal();
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const product = getProduct(productId)!;
  const maker = getProducer(product.producerId);
  const village = maker ? getVillage(maker.villageId) : undefined;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id);

  return (
    <Screen>
      <TopBar title={L(product.name)} />

      <img src={product.image} alt={L(product.name)} className="h-64 w-full object-cover" />

      <div className="px-4 pt-4">
        <h1 className="text-2xl leading-tight">{L(product.name)}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{L(product.unit)}</p>
        <p className="mt-3 font-display text-3xl text-primary">{rupee(product.price)}</p>
        <p className="mt-1 text-xs font-semibold text-success">
          {product.stock} in stock · {village ? L(village.name) : ""}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{L(product.story)}</p>
      </div>

      {maker ? (
        <div className="px-4 pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("meetTheMaker")}
          </p>
          <Link
            to="/producer/$producerId"
            params={{ producerId: maker.id }}
            className="surface mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-3"
          >
            <img src={maker.photo} alt={L(maker.name)} className="h-14 w-14 rounded-2xl object-cover" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{L(maker.name)}</span>
              <span className="block truncate text-xs text-muted-foreground">{L(maker.craft)}</span>
              <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                {maker.rating} ({maker.reviews})
              </span>
            </span>
          </Link>
        </div>
      ) : null}

      {related.length ? (
        <div className="px-4 pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("products")}
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-3">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="fixed bottom-[72px] left-0 right-0 z-30 mx-auto max-w-md px-4">
        <button
          type="button"
          onClick={() => {
            addToCart(product.id);
            navigate({ to: "/cart" });
          }}
          className="tap btn-primary w-full text-base"
        >
          {t("addToCart")} · {rupee(product.price)}
        </button>
      </div>
    </Screen>
  );
}
