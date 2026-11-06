const ROUTES = new Set(['analyze', 'compare', 'notes', 'about']);

export function routeFromHash(hash) {
  const value = String(hash || '').replace(/^#/, '');
  if (ROUTES.has(value)) return value;
  if (value === 'analysis' || value === 'results') return 'analyze';
  if (['molecular-notes', 'curious-dna', 'genetics-life', 'example-sources', 'molecular-explorers'].includes(value)) return 'notes';
  if (value === 'method') return 'about';
  return 'analyze';
}

export function initializeNavigation() {
  const display = (route = routeFromHash(location.hash)) => {
    document.querySelectorAll('.app-view').forEach(view => {
      view.hidden = view.dataset.view !== route;
    });
    document.querySelectorAll('[data-route-link]').forEach(link => {
      if (link.dataset.routeLink === route) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const target=document.getElementById(location.hash.slice(1));
    if(target && !ROUTES.has(location.hash.slice(1))) target.scrollIntoView({behavior:'auto'});
    else window.scrollTo({top:0,behavior:'auto'});
  };
  const navigate = route => {
    if (!ROUTES.has(route)) route = 'analyze';
    if (location.hash !== `#${route}`) history.pushState(null, '', `#${route}`);
    display(route);
  };
  document.querySelectorAll('[data-route-link]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); navigate(link.dataset.routeLink); }));
  window.addEventListener('hashchange', () => display());
  window.addEventListener('popstate', () => display());
  if (!location.hash) history.replaceState(null, '', '#analyze');
  display();
  return navigate;
}
