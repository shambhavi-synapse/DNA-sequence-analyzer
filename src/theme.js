export function initializeTheme() {
  const control = document.querySelector('#theme-select');
  const key = 'seqscope-theme';
  let stored = null;
  try { stored = localStorage.getItem(key) || localStorage.getItem('helix-lab-theme'); } catch { /* Use the system preference when storage is unavailable. */ }
  control.value = ['system', 'light', 'dark'].includes(stored) ? stored : 'system';
  const media = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const theme = control.value === 'system' ? (media.matches ? 'dark' : 'light') : control.value;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  };
  control.addEventListener('change', () => { try { localStorage.setItem(key, control.value); } catch { /* The selected theme still applies for this visit. */ } apply(); });
  media.addEventListener?.('change', () => { if (control.value === 'system') apply(); });
  apply();
}
