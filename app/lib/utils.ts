export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'fr-FR',
) => {
  dateStr = dateStr ?? 0
  const date = new Date(dateStr);

  var today = new Date();
  var isToday = (today.toDateString() == date.toDateString());
  
  let options: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
  };
  if (isToday) {
    options = {
      timeStyle: 'short',
    };
  }
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};