import { load as loadYaml } from "js-yaml";

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => loadYaml(contents));
  eleventyConfig.addPassthroughCopy("src/assets");
  // Custom domain file for GitHub Pages; only add src/CNAME once DNS is confirmed.
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.setServerOptions({ port: 8080 });

  return {
    dir: { input: "src", output: "dist", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk"],
  };
}
