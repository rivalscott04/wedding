
interface CalendarEvent {
  title: string;
  description: string;
  startDate: string;
  location: string;
}

export const addToCalendar = ({ title, description, startDate, location }: CalendarEvent) => {
  const event = {
    title,
    description,
    start: new Date(startDate).toISOString(),
    duration: [3, 'hour'],
    location,
  };

  // Format for Google Calendar
  const googleUrl = new URL('https://calendar.google.com/calendar/render');
  googleUrl.searchParams.append('action', 'TEMPLATE');
  googleUrl.searchParams.append('text', event.title);
  googleUrl.searchParams.append('details', event.description);
  googleUrl.searchParams.append('location', event.location);
  googleUrl.searchParams.append('dates', `${event.start.replace(/[-:]/g, '')}/${new Date(new Date(event.start).getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '')}`);

  window.open(googleUrl.toString(), '_blank');
};
