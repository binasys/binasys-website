// Register before first paint. Native document transitions require an HTTP origin.
// Local files and no-JavaScript visits retain normal links and the CSS entrance.
(() => {
  if (!/^https?:$/.test(location.protocol) || !('onpagereveal' in window)) return;
  const optIn = document.createElement('style');
  optIn.textContent = '@media(prefers-reduced-motion:no-preference){@view-transition{navigation:auto}}';
  document.head.append(optIn);
  addEventListener('pagereveal', event => {
    const transition = event.viewTransition;
    if (!transition) return;
    document.documentElement.classList.add('has-page-transition');
    // Skipped/rapid navigations can reject ready; normal navigation still succeeds.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) transition.skipTransition();
    // Retain the class: removing it would restart the fallback after the snapshot.
  });
})();
