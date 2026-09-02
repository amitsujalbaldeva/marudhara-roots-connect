import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Heart, Star, Users } from "lucide-react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { ProductCard } from "@/components/cards";
import { experiences, getProducer, getVillage, homestays, products } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

export const Route = createFileRoute("/producer/$producerId")({
  loader: ({ params }) => {
    const producer = getProducer(params.producerId);
    if (!producer) throw notFound();
    return { name: producer.name.en, craft: producer.craft.en };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Producer unavailable — MARUDHARA" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — MARUDHARA`;
    return {
      meta: [
        { title },
        { name: "description", content: `${loaderData.craft} from rural Rajasthan. Buy direct.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `${loaderData.craft} from rural Rajasthan.` },
      ],
    };
  },
  component: ProducerPage,
});

function ProducerPage() {
  const { producerId } = Route.useParams();
  const { t } = useLang();
  const L = useLocal();
  const { isFollowing, toggleFollow } = useApp();

  const producer = getProducer(producerId)!;
  const village = getVillage(producer.villageId);
  const own = products.filter((p) => p.producerId === producer.id);
  const stays = homestays.filter((h) => h.hostId === producer.id);
  const exps = experiences.filter((e) => e.hostId === producer.id);
  const following = isFollowing(producer.id);

  return (
    <Screen>
      <TopBar title={L(producer.name)} />

      <div className="px-4 pt-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <img
            src={producer.photo}
            alt={L(producer.name)}
            className="h-24 w-24 rounded-3xl object-cover"
          />
          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 text-xl leading-tight">
              {L(producer.name)}
              {producer.verified ? <BadgeCheck className="h-5 w-5 shrink-0 text-teal" /> : null}
            </h1>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{L(producer.craft)}</p>
            {village ? (
              <Link
                to="/village/$villageId"
                params={{ villageId: village.id }}
                className="mt-1 block truncate text-xs font-bold text-primary"
              >
                {L(village.name)} →
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="surface p-3 text-center">
            <p className="flex items-center justify-center gap-1 font-display text-lg">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {producer.rating}
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground">{producer.reviews}</p>
          </div>
          <div className="surface p-3 text-center">
            <p className="flex items-center justify-center gap-1 font-display text-lg">
              <Users className="h-4 w-4 text-teal" />
              {producer.followers}
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground">{t("following")}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleFollow(producer.id)}
            className={`tap ${following ? "btn-outline" : "btn-primary"} text-xs`}
          >
            <Heart className={`h-4 w-4 ${following ? "fill-primary text-primary" : ""}`} />
            {following ? t("following") : t("followProducer")}
          </button>
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("story")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L(producer.story)}</p>
        <p className="mt-3 text-xs font-semibold text-teal">{L(producer.shg)}</p>
      </div>

      {own.length ? (
        <>
          <SectionHead title={t("products")} />
          <ul className="grid grid-cols-2 gap-3 px-4">
            {own.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {stays.length || exps.length ? (
        <>
          <SectionHead title={t("experiences")} />
          <div className="grid gap-3 px-4">
            {stays.map((h) => (
              <Link
                key={h.id}
                to="/book/$kind/$id"
                params={{ kind: "homestay", id: h.id }}
                className="surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{L(h.name)}</span>
                  <span className="text-xs text-muted-foreground">{t("perNight")}</span>
                </span>
                <span className="font-display text-base text-primary">{rupee(h.price)}</span>
              </Link>
            ))}
            {exps.map((e) => (
              <Link
                key={e.id}
                to="/book/$kind/$id"
                params={{ kind: "experience", id: e.id }}
                className="surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{L(e.name)}</span>
                  <span className="text-xs text-muted-foreground">{L(e.duration)}</span>
                </span>
                <span className="font-display text-base text-primary">{rupee(e.price)}</span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </Screen>
  );
}
