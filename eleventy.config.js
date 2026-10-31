import { load as loadYaml } from "js-yaml";

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => loadYaml(contents));
  eleventyConfig.addPassthroughCopy("src/assets");
  // 1 -> "01": numbered items use two digits (house style).
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  // services.yaml -> JSON for the service dialog in app.js (single source of truth).
  eleventyConfig.addFilter("serviceData", (services) =>
    JSON.stringify(
      Object.fromEntries(
        services.map((s) => [
          s.id,
          {
            category: s.name.toUpperCase(),
            title: [].concat(s.headline).join(" "),
            intro: s.intro,
            offers: s.offers,
          },
        ]),
      ),
    ).replace(/</g, "\\u003c"),
  );
  // Custom domain file for GitHub Pages; only add src/CNAME once DNS is confirmed.
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.setServerOptions({ port: 8080 });

  return {
    dir: { input: "src", output: "dist", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk"],
  };
}
