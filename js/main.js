/* Everything dynamic (events, jams, sponsors) is loaded from /data/*.json.
   If you're adding a new list type, copy the shape of one of the render
   functions below. They all do the same three things: load, iterate, append. */


async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

/* If there's no end date we just show the start. */
function formatDate(startIso, endIso) {
  const start = new Date(startIso + 'T00:00:00');
  const startStr = start.toLocaleDateString('en-CA', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  if (!endIso) return startStr;

  const end = new Date(endIso + 'T00:00:00');
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth && sameYear) {
    const month = start.toLocaleDateString('en-CA', { month: 'short' });
    return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
  }
  const endStr = end.toLocaleDateString('en-CA', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  return `${startStr} – ${endStr}`;
}

function isPast(endIso) {
  if (!endIso) return false;
  const cutoff = new Date(endIso + 'T23:59:59');
  return cutoff < new Date();
}

/*  Events  */

function buildEventCard(ev, { past = false } = {}) {
  const card = document.createElement('article');
  card.className = 'event-card' + (past ? ' event-card-past' : '');

  const image = ev.image
    ? `<img class="event-image" src="assets/eventPhotos/${ev.image}" alt="${ev.title}">`
    : `<div class="placeholder-img">Event photo</div>`;

  const action = ev.url
    ? `<a class="btn btn-small btn-primary" href="${ev.url}" target="_blank" rel="noopener">${past ? 'Event page' : 'Register'}</a>`
    : `<span class="link-placeholder">Registration link TBD</span>`;

  var date;

  if(ev.date == ev.endDate){
    date = formatDate(ev.date)
  }
  else{
    date = formatDate(ev.date, ev.endDate)
  }

  card.innerHTML = `
    ${image}
    <div class="event-body">
      <p class="event-date">${date}</p>
      <h3 class="event-title">${ev.title}</h3>
      ${ev.location ? `<p class="event-location">${ev.location}</p>` : ''}
      ${ev.description ? `<p class="event-desc">${ev.description}</p>` : ''}
      <div class="event-actions">${action}</div>
    </div>
  `;
  return card;
}

async function renderEvents() {
  const nextEl     = document.getElementById('next-events');     // home page
  const upcomingEl = document.getElementById('upcoming-events'); // events page
  const pastEl     = document.getElementById('past-events');     // events page
  if (!nextEl && !upcomingEl && !pastEl) return;

  let events;
  try {
    events = await loadJSON('data/events.json');
  } catch (err) {
    console.error(err);
    [nextEl, upcomingEl, pastEl].forEach(el => {
      if (el) el.innerHTML = '<p class="empty-state">Could not load events.</p>';
    });
    return;
  }

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = [];
  const past = [];
  events.forEach(ev => {
    const endsAt = ev.endDate || ev.date;
    (isPast(endsAt) ? past : upcoming).push(ev);
  });

  // Home page: just the next two.
  if (nextEl) {
    nextEl.innerHTML = '';
    if (upcoming.length === 0) {
      nextEl.innerHTML = '<p class="empty-state">No upcoming events right now, check back soon.</p>';
    } else {
      upcoming.slice(0, 2).forEach(ev => nextEl.appendChild(buildEventCard(ev)));
    }
  }

  // Events page: everything upcoming.
  if (upcomingEl) {
    upcomingEl.innerHTML = '';
    if (upcoming.length === 0) {
      upcomingEl.innerHTML = '<p class="empty-state">No upcoming events right now, check back soon.</p>';
    } else {
      upcoming.forEach(ev => upcomingEl.appendChild(buildEventCard(ev)));
    }
  }

  // Events page: past, most recent first.
  if (pastEl) {
    pastEl.innerHTML = '';
    if (past.length === 0) {
      pastEl.innerHTML = '<p class="empty-state">No past events listed yet.</p>';
    } else {
      past.reverse().forEach(ev => pastEl.appendChild(buildEventCard(ev, { past: true })));
    }
  }
}

/*  Jams  */

async function renderJams() {
  const el = document.getElementById('jams-grid');
  if (!el) return;

  let jams;
  try {
    jams = await loadJSON('data/jams.json');
  } catch (err) {
    console.error(err);
    el.innerHTML = '<p class="empty-state">Could not load jams.</p>';
    return;
  }

  el.innerHTML = '';
  jams.forEach(jam => {
    const card = document.createElement('article');
    card.className = 'jam-card';

    const logo = jam.logo
      ? `<div class="jam-logo-wrap"><img class="jam-logo" src="assets/images/${jam.logo}" alt="${jam.name}"></div>`
      : `<div class="jam-logo-wrap"><div class="placeholder-img jam-logo-placeholder">Jam logo</div></div>`;

    const link = jam.url
      ? `<a class="jam-link" href="${jam.url}" target="_blank" rel="noopener">Learn more →</a>`
      : `<span class="link-placeholder">Link TBD</span>`;

    card.innerHTML = `
      ${logo}
      <h3 class="jam-name">${jam.name}</h3>
      ${jam.blurb ? `<p class="jam-blurb">${jam.blurb}</p>` : ''}
      ${link}
    `;
    el.appendChild(card);
  });
}

/*  Sponsors  */

async function renderSponsors() {
  const el = document.getElementById('sponsors-grid');
  if (!el) return;

  let sponsors;
  try {
    sponsors = await loadJSON('data/sponsors.json');
  } catch (err) {
    console.error(err);
    el.innerHTML = '<p class="empty-state">Could not load sponsors.</p>';
    return;
  }

  el.innerHTML = '';
  if (!sponsors.length) {
    el.innerHTML = '<p class="empty-state">Sponsor list coming soon.</p>';
    return;
  }

  // Rendered in array order - reorder sponsors.json to reorder the grid.
  sponsors.forEach(s => {
    const a = document.createElement('a');
    a.className = 'sponsor';
    if (s.url) {
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = '#';
      a.addEventListener('click', e => e.preventDefault());
    }

    a.innerHTML = s.file
      ? `<img src="assets/sponsors/${s.file}" alt="${s.alt || s.name || 'Sponsor'}">`
      : `<div class="placeholder-img sponsor-placeholder">Sponsor logo</div>`;

    el.appendChild(a);
  });
}

/*  Mobile nav toggle  */

const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu after tapping any link inside it
  document.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/*  Boot  */

document.getElementById('year').textContent = new Date().getFullYear();
renderEvents();
renderJams();
renderSponsors();