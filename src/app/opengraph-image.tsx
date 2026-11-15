import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * Default preview card for links shared on Facebook, WhatsApp, Messenger...
 * Used by every page that doesn't have its own picture (product pages use the product photo).
 * Built once at build time.
 */

export const alt = "Modz Tech: authentic gadgets and mobile accessories, cash on delivery all over Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site colours (globals.css): chrome, on-chrome, on-chrome-muted, chrome-accent, offer-chrome.
const COLORS = { bg: "#05060a", text: "#eef1f5", muted: "#9aa3b0", accent: "#66aae7", offer: "#fc7b03" };

const OpenGraphImage = async () => {
  const logo = await readFile(join(process.cwd(), "public/brand/modz-tech-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at 50% 38%, #12233a 0%, ${COLORS.bg} 62%)`,
          color: COLORS.text,
        }}
      >
        {/* Logo is 1914×822 */}
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse only supports <img> */}
        <img src={logoSrc} alt="" width={560} height={241} />
        <div style={{ display: "flex", marginTop: 36, fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>
          Gadgets &amp; mobile accessories
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 30, color: COLORS.muted }}>
          100% authentic · Cash on delivery all over Bangladesh
        </div>
        <div style={{ display: "flex", position: "absolute", bottom: 0, left: 0, right: 0, height: 10 }}>
          <div style={{ flex: 3, background: COLORS.accent }} />
          <div style={{ flex: 1, background: COLORS.offer }} />
        </div>
      </div>
    ),
    size,
  );
};

export default OpenGraphImage;
