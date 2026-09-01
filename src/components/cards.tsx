import { Link } from "@tanstack/react-router";
import { MapPin, Star, Heart } from "lucide-react";
import { districtName, type Producer, type Product, type Village } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

export function VillageCard({ village }: { village: Village }) {
  const L = useLocal();
  const { t } = useLang();

  return (
    <article className="surface overflow-hidden">
      <div className="relative h-44">
        <img
          src={village.cover}
          alt={L(village.name)}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-veil" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider opacity-90">
            <MapPin className="h-3.5 w-3.5" />
            {L(districtName(village.district))}
          </p>
          <h3 className="mt-1 text-xl leading-tight">{L(village.name)}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{L(village.tagline)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {village.crafts.map((c) => (
            <span key={c.en} className="chip">
              {L(c)}
            </span>
          ))}
        </div>
        <Link
          to="/village/$villageId"
          params={{ villageId: village.id }}
          className="tap btn-primary mt-4 w-full text-sm"
        >
          {t("exploreVillage")}
        </Link>
      </div>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const L = useLocal();
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="surface block overflow-hidden"
    >
      <img
        src={product.image}
        alt={L(product.name)}
        loading="lazy"
        className="h-32 w-full object-cover"
      />
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{L(product.name)}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">{L(product.unit)}</p>
        <p className="mt-2 font-display text-lg text-primary">{rupee(product.price)}</p>
      </div>
    </Link>
  );
}

export function MakerCard({ producer }: { producer: Producer }) {
  const L = useLocal();
  const { t } = useLang();
  const { isFollowing, toggleFollow } = useApp();
  const following = isFollowing(producer.id);

  return (
    <article className="surface grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-3">
      <img
        src={producer.photo}
        alt={L(producer.name)}
        loading="lazy"
        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
      />
      <div className="min-w-0">
        <Link
          to="/producer/$producerId"
          params={{ producerId: producer.id }}
          className="block truncate text-base font-bold"
        >
          {L(producer.name)}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{L(producer.craft)}</p>
        <div className="mt-1 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {producer.rating} ({producer.reviews})
          </span>
          <button
            type="button"
            onClick={() => toggleFollow(producer.id)}
            className={`flex items-center gap-1 rounded-full px-2 py-1 ${
              following ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${following ? "fill-primary" : ""}`} />
            {following ? t("following") : t("followProducer")}
          </button>
        </div>
      </div>
    </article>
  );
}
