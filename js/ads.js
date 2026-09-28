/*
 * Google Ads measurement for flyingstarsfengshui.net: which ads bring people who
 * sign up or subscribe. Added 28 Sep 2026 for the first ad campaigns.
 *
 * Only on this website and the web app in a browser. The iPhone, iPad, Mac,
 * Android and Windows apps never load it (see src/ads.ts), and the privacy
 * policy says so.
 *
 * Consent (Google Consent Mode v2):
 *  - In the EEA, the UK and Switzerland nothing is stored until the visitor
 *    presses Accept.
 *  - Elsewhere measurement is on until the visitor presses No thanks.
 *  - Ad personalisation (remarketing) is off everywhere: we never build
 *    audiences from visitors.
 *  - Enhanced conversions stay off: no email or other personal data is sent.
 * The choice is kept in this browser (localStorage) and applies to the site and
 * the web app alike, which share an address.
 */
(function () {
  if (window.fsAds) return;

  var TAG = 'AW-18472208775';
  var SEND_TO = {
    signUp: TAG + '/BBz3CMaakYkdEIeTnuhE',
    subscribe: TAG + '/DBy-CIKOlIkdEIeTnuhE'
  };
  var KEY = 'fs-ad-consent';
  // EEA, UK and Switzerland: opt-in.
  var OPT_IN = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
    'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function state(yes) {
    var v = yes ? 'granted' : 'denied';
    return { ad_storage: v, ad_user_data: v, ad_personalization: 'denied', analytics_storage: 'denied' };
  }
  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private window: asked again next visit */ }
  }

  var denied = state(false);
  denied.region = OPT_IN;
  denied.wait_for_update = 500;
  gtag('consent', 'default', denied);
  gtag('consent', 'default', state(true));
  var choice = saved();
  if (choice === 'yes' || choice === 'no') gtag('consent', 'update', state(choice === 'yes'));
  // Without cookies, the ad click id rides along in the link from the site to the app.
  gtag('set', 'url_passthrough', true);
  gtag('set', 'ads_data_redaction', true);
  gtag('js', new Date());
  gtag('config', TAG);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG;
  document.head.appendChild(s);

  window.fsAds = {
    /** A new account, once. The caller makes sure it is new. */
    signUp: function () {
      gtag('event', 'conversion', { send_to: SEND_TO.signUp });
    },
    /** Pro bought by card on the web. value in the currency charged. */
    subscribe: function (value, currency) {
      var p = { send_to: SEND_TO.subscribe };
      if (typeof value === 'number' && value > 0 && currency) { p.value = value; p.currency = currency; }
      gtag('event', 'conversion', p);
    }
  };

  if (choice === 'yes' || choice === 'no') return;

  function banner() {
    if (document.getElementById('fs-consent')) return;
    var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var bar = document.createElement('div');
    bar.id = 'fs-consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie choice');
    bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:640px;margin:0 auto;'
      + 'padding:14px 16px;border-radius:10px;font:14px/1.45 -apple-system,Segoe UI,Roboto,sans-serif;'
      + 'box-shadow:0 6px 24px rgba(0,0,0,.18);display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;'
      + (dark ? 'background:#1d2026;color:#eef1f0;border:1px solid #2c3138;' : 'background:#fff;color:#16181a;border:1px solid #e3e5e4;');
    var text = document.createElement('span');
    text.style.cssText = 'flex:1 1 260px;';
    text.innerHTML = 'We use a cookie to learn which of our ads bring people here. '
      + 'Nothing from your projects is shared. <a href="/privacy.html#advertising" style="color:inherit">Privacy</a>';
    function button(label, primary, yes) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'font:inherit;padding:7px 14px;border-radius:7px;cursor:pointer;'
        + (primary ? 'background:#8c1d18;color:#fff;border:1px solid #8c1d18;'
                   : 'background:transparent;color:inherit;border:1px solid ' + (dark ? '#4a5058' : '#c9ccca') + ';');
      b.onclick = function () {
        save(yes ? 'yes' : 'no');
        gtag('consent', 'update', state(yes));
        bar.remove();
      };
      return b;
    }
    bar.appendChild(text);
    bar.appendChild(button('No thanks', false, false));
    bar.appendChild(button('Accept', true, true));
    document.body.appendChild(bar);
  }
  if (document.body) banner();
  else document.addEventListener('DOMContentLoaded', banner);
})();
