// Netlify function to generate a minimal iCalendar file (RFC 5545)

const events = require('../../events/events.json');

exports.handler = async function(event) {
  const params = event.queryStringParameters || {};
  const id = params.id;
  if (!id) {
    return { statusCode: 400, body: 'Missing id' };
  }
  const ev = events.find(e => e.id === id);
  if (!ev) {
    return { statusCode: 404, body: 'Not found' };
  }
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const dtStart = new Date(ev.start).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const dtEnd = new Date(ev.end).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Emory Christian Fellowship//ECF Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ev.id}@yourdomain.edu`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${ev.title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${(ev.description || '').replace(/\n/g, ' ')}`,
    ev.locationName ? `LOCATION:${ev.locationName}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${ev.id}.ics"`,
    },
    body: lines,
  };
};