/** One editorial source, two views. Hashes make mode and topic history reproducible. */
export function notesModeFromHash(hash) {
  return hash === '#notes-overview' ? 'overview' : 'reading';
}

export function initializeNotesView({doc = document, win = window} = {}) {
  const tabs = [...doc.querySelectorAll('[data-notes-mode]')];
  const panels = {
    reading: doc.getElementById('notes-reading-panel'),
    overview: doc.getElementById('notes-overview-panel')
  };
  const groups = [
    ['Genetics in everyday life', '.life-grid .life-card'],
    ['Essential concepts', '.note-grid .editorial-card'],
    ['Genomic structure, variation and regulation', '.curious-grid .curious-card']
  ];
  for (const [heading, selector] of groups) {
    const section = doc.createElement('section');
    section.className = 'notes-index-group';
    const title = doc.createElement('h3');
    title.textContent = heading;
    section.append(title);
    const list = doc.createElement('ol');
    for (const [index, article] of [...doc.querySelectorAll(selector)].entries()) {
      const item = doc.createElement('li');
      const link = doc.createElement('a');
      link.href = `#${article.id}`;
      const number = doc.createElement('span');
      number.className = 'notes-index-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const copy = doc.createElement('span');
      const name = doc.createElement('strong');
      name.textContent = article.querySelector('h3').textContent;
      const summary = doc.createElement('span');
      summary.className = 'notes-index-summary';
      summary.textContent = article.dataset.summary;
      copy.append(name, summary);
      const action = doc.createElement('span');
      action.className = 'notes-index-action';
      action.textContent = 'Read →';
      action.setAttribute('aria-hidden', 'true');
      link.append(number, copy, action);
      item.append(link);
      list.append(item);
    }
    section.append(list);
    panels.overview.append(section);
  }
  const sync = hash => {
    const mode = notesModeFromHash(hash);
    for (const tab of tabs) {
      const selected = tab.dataset.notesMode === mode;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const [name, panel] of Object.entries(panels)) panel.hidden = name !== mode;
  };
  const activate = tab => {
    const hash = `#notes-${tab.dataset.notesMode}`;
    if (win.location.hash !== hash) win.history.pushState(null, '', hash);
    sync(hash); // Deliberately preserve the reader's scroll position.
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus({preventScroll: true});
      activate(tabs[next]);
    });
  });
  sync(win.location.hash);
  return sync;
}
