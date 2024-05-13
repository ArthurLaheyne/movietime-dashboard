export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'fr-FR',
) => {
  dateStr = dateStr ?? 0
  const date = new Date(dateStr);
  
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};