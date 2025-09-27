// scripts/events.js

const eventList = document.getElementById('event-list');

// Format date/time
const fmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

// Convert date string to UTC stamp for calendar URLs
function toUTC(dateString) {
  const iso = new Date(dateString);
  return iso.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

// Build Google Calendar template link
function buildGoogleCalendarUrl(ev) {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: ev.title,
    details: ev.description || '',
    location: ev.locationName || '',
    dates: `${toUTC(ev.start)}/${toUTC(ev.end)}`,
  });
  return `${base}&${params.toString()}`;
}

// Build ics download link
function buildIcsUrl(ev) {
  return `/api/ics?id=${encodeURIComponent(ev.id)}`;
}

function cardTemplate(ev) {
  return `\
    <article class="card" role="listitem">
      <h2>${ev.title}</h2>
      <p><time datetime="${ev.start}">${fmt.format(new Date(ev.start))}</time> – <time datetime="${ev.end}">${fmt.format(new Date(ev.end))}</time></p>
      ${ev.locationName ? `<p><a href="${ev.locationUrl || '#'}" target="_blank" rel="noopener">${ev.locationName}</a></p>` : ''}
      ${ev.registrationUrl ? `<p><a class="btn" href="${ev.registrationUrl}" target="_blank" rel="noopener">Register</a></p>` : ''}
      <p>
        <a href="${buildGoogleCalendarUrl(ev)}" target="_blank" rel="noopener">Add to Google Calendar</a>
        &nbsp;•&nbsp;
        <a href="${buildIcsUrl(ev)}">ICS</a>
      </p>
    </article>
  `;
}

async function loadEvents() {
  try {
    // Fetch events JSON relative to the site root. If deployed at a subpath the relative path will still work.
    const res = await fetch('events/events.json');
    const events = await res.json();
    const upcoming = events.filter(ev => ev.status === 'published');
    upcoming.sort((a, b) => new Date(a.start) - new Date(b.start));
    eventList.innerHTML = upcoming.map(cardTemplate).join('');
  } catch (err) {
    console.error(err);
    eventList.innerHTML = '<p>Unable to load events at this time.</p>';
  }
}

if (eventList) {
  loadEvents();
}