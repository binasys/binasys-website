import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// A changed file gets a new browser cache key on the next build.
export default function () {
  const files = {
    tokens: "assets/brand/tokens.css",
    styles: "assets/css/site.css",
    navigation: "assets/js/navigation.js",
    app: "assets/js/app.js",
  };

  return Object.fromEntries(
    Object.entries(files).map(([key, path]) => {
      const contents = readFileSync(new URL(`../${path}`, import.meta.url));
      const version = createHash("sha256").update(contents).digest("hex").slice(0, 12);
      return [key, `${path}?v=${version}`];
    }),
  );
}
