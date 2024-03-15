export function convertTime(inputTime: string): string {
  const inputDate = new Date(inputTime);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  const formattedDate = inputDate.toLocaleDateString('en-US', options);
  return formattedDate.replace(',', '');
}

export function formatShortDate(input: string): string {
  const dateObject = new Date(input);

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();
  return `${month}/${day}/${year}`;
}
