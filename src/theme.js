// Runs before stylesheets so the first paint uses the selected or system theme.
(() => {
  const root = document.documentElement;
  const key = 'seqscope-theme';
  const valid = value => ['system', 'light', 'dark'].includes(value);
  const media = matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try {
    const stored = localStorage.getItem(key) ?? localStorage.getItem('helix-lab-theme');
    if (valid(stored)) preference = stored;
  } catch { /* System remains usable when storage is unavailable. */ }

  const apply = () => {
    const theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#18191b' : '#f4f0e8');
  };
  const bind = () => {
    const control = document.querySelector('#theme-select');
    if (!control) return;
    control.value = preference;
    control.addEventListener('change', () => {
      preference = valid(control.value) ? control.value : 'system';
      try { localStorage.setItem(key, preference); } catch { /* Applies for this visit. */ }
      apply();
    });
    window.addEventListener('storage', event => {
      if (event.key !== key && event.key !== null) return;
      preference = valid(event.newValue) ? event.newValue : 'system';
      control.value = preference;
      apply();
    });
  };
  apply();
  if (media.addEventListener) media.addEventListener('change', () => { if (preference === 'system') apply(); });
  else media.addListener(() => { if (preference === 'system') apply(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true});
  else bind();
})();
