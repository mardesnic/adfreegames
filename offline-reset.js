// Loaded by every page. If the page's script can't load (an offline copy saved half way
// through an update), drop this page's offline copy and load it
// fresh, once. Saved games are in localStorage and are kept.
addEventListener(
  'error',
  function (e) {
    var el = e.target;
    if (!el || el.tagName !== 'SCRIPT' || !('serviceWorker' in navigator))
      return;
    if (sessionStorage.getItem('kids-games-reset')) return;
    sessionStorage.setItem('kids-games-reset', '1');
    var base = location.origin + '/des-kids-games/';
    navigator.serviceWorker
      .getRegistrations()
      .then(function (rs) {
        return Promise.all(
          rs
            .filter(function (r) {
              return r.scope === base;
            })
            .map(function (r) {
              return r.unregister();
            })
        );
      })
      .then(function () {
        return caches.keys();
      })
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k.indexOf(base) !== -1;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        location.reload();
      });
  },
  true
);
