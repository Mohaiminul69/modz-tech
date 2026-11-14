"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { saveSettings } from "@/app/admin/actions/settings";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { SettingsInput } from "@/lib/admin/settings-schema";
import { ImageUploader } from "./image-uploader";
import { useAdminAction } from "./use-admin-action";

type Slide = SettingsInput["heroSlides"][number];
type Tile = SettingsInput["promoTiles"][number];

const cardClass = "flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 lg:p-5";
const labelClass = "text-label font-semibold text-ink";
const hintClass = "text-small font-normal text-ink-muted";

const toFee = (value: string) => {
  const number = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(number) ? number : null;
};

const Field = ({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "email" | "url" | "tel";
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className={labelClass}>
      {label} {hint && <span className={hintClass}>{hint}</span>}
    </label>
    <Input id={id} type={type} inputMode={inputMode} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
  </div>
);

const emptySlide = (): Slide => ({
  eyebrow: "",
  badge: "",
  headline: [""],
  description: "",
  descriptionLong: "",
  price: null,
  oldPrice: null,
  ctaLabel: "Order now",
  ctaHref: "/",
  image: { src: "", alt: "", position: "" },
});

const move = <T,>(list: T[], index: number, by: number) => {
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(index + by, 0, item);
  return next;
};

export const SettingsForm = ({ initial }: { initial: SettingsInput }) => {
  const id = useId();
  const { pending, run } = useAdminAction();
  const [values, setValues] = useState(initial);
  const [fees, setFees] = useState({
    inside: initial.delivery.insideDhaka.fee == null ? "" : String(initial.delivery.insideDhaka.fee),
    outside: initial.delivery.outsideDhaka.fee == null ? "" : String(initial.delivery.outsideDhaka.fee),
  });

  const set = <K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) => setValues((current) => ({ ...current, [key]: value }));
  const setSlide = (index: number, patch: Partial<Slide>) =>
    set(
      "heroSlides",
      values.heroSlides.map((slide, position) => (position === index ? { ...slide, ...patch } : slide)),
    );
  const setTile = (index: number, patch: Partial<Tile>) =>
    set(
      "promoTiles",
      values.promoTiles.map((tile, position) => (position === index ? { ...tile, ...patch } : tile)),
    );
  const banner = values.saleBanner;
  const setBanner = (patch: Partial<SettingsInput["saleBanner"]>) => set("saleBanner", { ...banner, ...patch });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    run(() =>
      saveSettings({
        ...values,
        delivery: {
          insideDhaka: { ...values.delivery.insideDhaka, fee: toFee(fees.inside) },
          outsideDhaka: { ...values.delivery.outsideDhaka, fee: toFee(fees.outside) },
        },
        heroSlides: values.heroSlides.map((slide) => ({ ...slide, headline: slide.headline.filter((line) => line.trim()) })),
      }),
    );
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <section className={cardClass} aria-labelledby={`${id}-contact`}>
        <h2 id={`${id}-contact`} className="text-panel-title text-ink">
          Contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-phone`} label="Phone" value={values.phone} onChange={(value) => set("phone", value)} placeholder="+880 1786-503069" inputMode="tel" />
          <Field id={`${id}-email`} label="Email" value={values.email} onChange={(value) => set("email", value)} inputMode="email" />
          <Field id={`${id}-hours`} label="Opening hours" hint='(shown as "Open every day, …")' value={values.hours} onChange={(value) => set("hours", value)} placeholder="10am–11pm" />
          <Field id={`${id}-fb`} label="Facebook page link" value={values.facebookUrl} onChange={(value) => set("facebookUrl", value)} inputMode="url" />
          <Field id={`${id}-messenger`} label="Messenger link" value={values.messengerUrl} onChange={(value) => set("messengerUrl", value)} placeholder="https://m.me/…" inputMode="url" />
          <Field id={`${id}-whatsapp`} label="WhatsApp link" value={values.whatsappUrl} onChange={(value) => set("whatsappUrl", value)} placeholder="https://wa.me/8801…" inputMode="url" />
        </div>
      </section>

      <section className={cardClass} aria-labelledby={`${id}-delivery`}>
        <h2 id={`${id}-delivery`} className="text-panel-title text-ink">
          Delivery
        </h2>
        <p className={hintClass}>Leave a fee empty to show &quot;Confirmed on the call&quot; at checkout.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-in-fee`} label="Inside Dhaka fee (৳)" value={fees.inside} onChange={(value) => setFees({ ...fees, inside: value })} placeholder="70" inputMode="numeric" />
          <Field
            id={`${id}-in-time`}
            label="Inside Dhaka time"
            value={values.delivery.insideDhaka.time}
            onChange={(time) => set("delivery", { ...values.delivery, insideDhaka: { ...values.delivery.insideDhaka, time } })}
            placeholder="1–2 working days"
          />
          <Field id={`${id}-out-fee`} label="Outside Dhaka fee (৳)" value={fees.outside} onChange={(value) => setFees({ ...fees, outside: value })} placeholder="130" inputMode="numeric" />
          <Field
            id={`${id}-out-time`}
            label="Outside Dhaka time"
            value={values.delivery.outsideDhaka.time}
            onChange={(time) => set("delivery", { ...values.delivery, outsideDhaka: { ...values.delivery.outsideDhaka, time } })}
            placeholder="2–4 working days"
          />
        </div>
      </section>

      <section className={cardClass} aria-labelledby={`${id}-hero`}>
        <div className="flex items-center justify-between gap-3">
          <h2 id={`${id}-hero`} className="text-panel-title text-ink">
            Home hero slides
          </h2>
          <Button type="button" size="sm" variant="outline" disabled={values.heroSlides.length >= 6} onClick={() => set("heroSlides", [...values.heroSlides, emptySlide()])}>
            <Plus aria-hidden="true" strokeWidth={1.5} /> Add slide
          </Button>
        </div>
        {values.heroSlides.length === 0 && <p className={hintClass}>No slides: the hero banner is hidden.</p>}
        <ol className="flex flex-col gap-3">
          {values.heroSlides.map((slide, index) => (
            <li key={index} className="flex flex-col gap-3 rounded-md border border-border p-3">
              <div className="flex items-center gap-1">
                <span className="flex-1 text-label font-semibold text-ink">Slide {index + 1}</span>
                <Button type="button" size="icon-sm" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => set("heroSlides", move(values.heroSlides, index, -1))}>
                  <ArrowUp aria-hidden="true" />
                </Button>
                <Button type="button" size="icon-sm" variant="ghost" aria-label="Move down" disabled={index === values.heroSlides.length - 1} onClick={() => set("heroSlides", move(values.heroSlides, index, 1))}>
                  <ArrowDown aria-hidden="true" />
                </Button>
                <Button type="button" size="icon-sm" variant="destructive" aria-label="Remove slide" onClick={() => set("heroSlides", values.heroSlides.filter((_, position) => position !== index))}>
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id={`${id}-s${index}-eyebrow`} label="Small label" value={slide.eyebrow} onChange={(eyebrow) => setSlide(index, { eyebrow })} placeholder="Hoco EQ34 Plus" />
                <Field id={`${id}-s${index}-badge`} label="Orange pill" hint="(optional)" value={slide.badge} onChange={(badge) => setSlide(index, { badge })} placeholder="Launch offer" />
                <Field id={`${id}-s${index}-h1`} label="Headline line 1" value={slide.headline[0] ?? ""} onChange={(line) => setSlide(index, { headline: [line, slide.headline[1] ?? ""] })} placeholder="Premium sound." />
                <Field id={`${id}-s${index}-h2`} label="Headline line 2" hint="(optional)" value={slide.headline[1] ?? ""} onChange={(line) => setSlide(index, { headline: [slide.headline[0] ?? "", line] })} placeholder="Budget price." />
                <Field id={`${id}-s${index}-desc`} label="Short line (phones)" value={slide.description} onChange={(description) => setSlide(index, { description })} />
                <Field id={`${id}-s${index}-desc2`} label="Longer line (desktop)" hint="(optional)" value={slide.descriptionLong} onChange={(descriptionLong) => setSlide(index, { descriptionLong })} />
                <Field id={`${id}-s${index}-price`} label="Price (৳)" hint="(optional)" value={slide.price == null ? "" : String(slide.price)} onChange={(value) => setSlide(index, { price: toFee(value) })} inputMode="numeric" />
                <Field id={`${id}-s${index}-old`} label="Old price (৳)" hint="(optional)" value={slide.oldPrice == null ? "" : String(slide.oldPrice)} onChange={(value) => setSlide(index, { oldPrice: toFee(value) })} inputMode="numeric" />
                <Field id={`${id}-s${index}-cta`} label="Button text" value={slide.ctaLabel} onChange={(ctaLabel) => setSlide(index, { ctaLabel })} />
                <Field id={`${id}-s${index}-href`} label="Button link" value={slide.ctaHref} onChange={(ctaHref) => setSlide(index, { ctaHref })} placeholder="/product/hoco-eq34-plus" />
              </div>
              <ImageUploader
                images={slide.image.src ? [slide.image] : []}
                onChange={(images) => setSlide(index, { image: { src: images[0]?.src ?? "", alt: slide.image.alt, position: slide.image.position } })}
                folder="banners"
                max={1}
                label="Photo"
              />
              <Field id={`${id}-s${index}-alt`} label="Photo description" hint="(for screen readers)" value={slide.image.alt} onChange={(alt) => setSlide(index, { image: { ...slide.image, alt } })} />
            </li>
          ))}
        </ol>
      </section>

      <section className={cardClass} aria-labelledby={`${id}-tiles`}>
        <div className="flex items-center justify-between gap-3">
          <h2 id={`${id}-tiles`} className="text-panel-title text-ink">
            Promo tiles
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={values.promoTiles.length >= 8}
            onClick={() => set("promoTiles", [...values.promoTiles, { href: "/shop", image: { src: "", alt: "" } }])}
          >
            <Plus aria-hidden="true" strokeWidth={1.5} /> Add tile
          </Button>
        </div>
        <p className={hintClass}>Poster images (4:5) in a 2×2 grid on phones, 4 across on desktop.</p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {values.promoTiles.map((tile, index) => (
            <li key={index} className="flex flex-col gap-3 rounded-md border border-border p-3">
              <div className="flex items-center gap-1">
                <span className="flex-1 text-label font-semibold text-ink">Tile {index + 1}</span>
                <Button type="button" size="icon-sm" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => set("promoTiles", move(values.promoTiles, index, -1))}>
                  <ArrowUp aria-hidden="true" />
                </Button>
                <Button type="button" size="icon-sm" variant="destructive" aria-label="Remove tile" onClick={() => set("promoTiles", values.promoTiles.filter((_, position) => position !== index))}>
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
              <ImageUploader
                images={tile.image.src ? [tile.image] : []}
                onChange={(images) => setTile(index, { image: { src: images[0]?.src ?? "", alt: tile.image.alt } })}
                folder="banners"
                max={1}
                label="Poster"
              />
              <Field id={`${id}-t${index}-href`} label="Link" value={tile.href} onChange={(href) => setTile(index, { href })} placeholder="/category/smart-watches" />
              <Field id={`${id}-t${index}-alt`} label="Description" value={tile.image.alt} onChange={(alt) => setTile(index, { image: { ...tile.image, alt } })} />
            </li>
          ))}
        </ol>
      </section>

      <section className={cardClass} aria-labelledby={`${id}-sale`}>
        <h2 id={`${id}-sale`} className="text-panel-title text-ink">
          Sale banner
        </h2>
        <div className="flex items-center gap-2.5">
          <Checkbox id={`${id}-sale-on`} checked={banner.enabled} onCheckedChange={(value) => setBanner({ enabled: value === true })} />
          <label htmlFor={`${id}-sale-on`} className="text-body text-ink">
            Show the sale banner on the home page
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-sale-badge`} label="Badge" value={banner.badge} onChange={(badge) => setBanner({ badge })} placeholder="Sale" />
          <Field id={`${id}-sale-title`} label="Title" value={banner.title} onChange={(title) => setBanner({ title })} placeholder="Unleash your sound." />
          <Field id={`${id}-sale-desc`} label="Line" value={banner.description} onChange={(description) => setBanner({ description })} />
          <Field id={`${id}-sale-ends`} label="Ends on" hint="(countdown; optional)" type="date" value={banner.endsAt} onChange={(endsAt) => setBanner({ endsAt })} />
          <Field id={`${id}-sale-cta`} label="Button text" value={banner.ctaLabel} onChange={(ctaLabel) => setBanner({ ctaLabel })} placeholder="Shop speakers" />
          <Field id={`${id}-sale-href`} label="Button link" value={banner.ctaHref} onChange={(ctaHref) => setBanner({ ctaHref })} placeholder="/category/speakers" />
        </div>
        <ImageUploader
          images={banner.image.src ? [banner.image] : []}
          onChange={(images) => setBanner({ image: { src: images[0]?.src ?? "", alt: banner.image.alt, position: banner.image.position } })}
          folder="banners"
          max={1}
          label="Photo"
        />
        <Field id={`${id}-sale-alt`} label="Photo description" value={banner.image.alt} onChange={(alt) => setBanner({ image: { ...banner.image, alt } })} />
      </section>

      <div className="sticky bottom-0 z-30 -mx-4 border-t border-border bg-surface px-4 py-3 lg:mx-0 lg:rounded-lg lg:border">
        <Button type="submit" disabled={pending} className="min-w-36">
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
};
