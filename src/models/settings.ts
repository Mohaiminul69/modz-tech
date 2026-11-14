import { type Model, Schema, model, models } from "mongoose";

/*
 * Shop settings, edited from the admin Settings page. There is exactly one
 * document, with key "site".
 */

export type DeliveryOption = {
  /** Fee in taka. Unset until the admin fills it in. */
  fee?: number;
  /** e.g. "1–2 working days". */
  time?: string;
};

export type HeroSlideDoc = {
  eyebrow: string;
  badge?: string;
  /** Each entry is one line of the headline. */
  headline: string[];
  description: string;
  descriptionLong?: string;
  price?: number;
  oldPrice?: number;
  ctaLabel: string;
  ctaHref: string;
  image: { src: string; alt: string; position?: string };
};

export type PromoTileDoc = {
  href: string;
  image: { src: string; alt: string };
};

export type SaleBannerDoc = {
  enabled: boolean;
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  endsAt?: Date;
  image: { src: string; alt: string; position?: string };
};

export type SettingsDoc = {
  key: "site";
  phone: string;
  email: string;
  hours: string;
  facebookUrl: string;
  messengerUrl: string;
  /** e.g. "https://wa.me/8801786503069" */
  whatsappUrl: string;
  delivery: {
    insideDhaka: DeliveryOption;
    outsideDhaka: DeliveryOption;
  };
  heroSlides: HeroSlideDoc[];
  promoTiles: PromoTileDoc[];
  saleBanner: SaleBannerDoc;
  createdAt: Date;
  updatedAt: Date;
};

const imageFields = {
  src: { type: String, required: true },
  alt: { type: String, default: "" },
  position: String,
};

const deliverySchema = new Schema<DeliveryOption>({ fee: { type: Number, min: 0 }, time: String }, { _id: false });

const settingsSchema = new Schema<SettingsDoc>(
  {
    key: { type: String, required: true, unique: true, default: "site", enum: ["site"] },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    hours: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    messengerUrl: { type: String, default: "" },
    whatsappUrl: { type: String, default: "" },
    delivery: {
      insideDhaka: { type: deliverySchema, default: () => ({}) },
      outsideDhaka: { type: deliverySchema, default: () => ({}) },
    },
    heroSlides: {
      type: [
        new Schema<HeroSlideDoc>({
          eyebrow: { type: String, required: true },
          badge: String,
          headline: { type: [String], required: true },
          description: { type: String, required: true },
          descriptionLong: String,
          price: Number,
          oldPrice: Number,
          ctaLabel: { type: String, required: true },
          ctaHref: { type: String, required: true },
          image: new Schema(imageFields, { _id: false }),
        }),
      ],
      default: [],
    },
    promoTiles: {
      type: [
        new Schema<PromoTileDoc>({
          href: { type: String, required: true },
          image: new Schema({ src: { type: String, required: true }, alt: { type: String, default: "" } }, { _id: false }),
        }),
      ],
      default: [],
    },
    saleBanner: {
      type: new Schema<SaleBannerDoc>(
        {
          enabled: { type: Boolean, default: false },
          badge: { type: String, default: "Sale" },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          ctaLabel: { type: String, default: "" },
          ctaHref: { type: String, default: "" },
          endsAt: Date,
          image: new Schema(imageFields, { _id: false }),
        },
        { _id: false },
      ),
      default: () => ({ enabled: false }),
    },
  },
  { timestamps: true },
);

export const Settings: Model<SettingsDoc> =
  (models.Settings as Model<SettingsDoc> | undefined) ?? model<SettingsDoc>("Settings", settingsSchema);
