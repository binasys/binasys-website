// Build mode. Example content (proof.yaml items with placeholder: true) is only shown when
// previewing locally with `npm start`. The live build (`npm run build`) hides it.
export default {
  preview: process.env.ELEVENTY_RUN_MODE === "serve",
};
