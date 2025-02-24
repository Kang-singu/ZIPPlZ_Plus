export function formatDateWithTime(inputDateString: string) {
  const inputDate = new Date(inputDateString);

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');
  const hours = String(inputDate.getHours()).padStart(2, '0');
  const minutes = String(inputDate.getMinutes()).padStart(2, '0');

  const formattedDate = `${year}.${month}.${day} ${hours}:${minutes}`;

  return formattedDate;
}

export function formatDate(inputDateString: string) {
  const inputDate = new Date(inputDateString);

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}.${month}.${day}`;

  return formattedDate;
}

export function formatTime(inputDateString: string) {
  const inputDate = new Date(inputDateString);

  const hours = String(inputDate.getHours()).padStart(2, '0');
  const minutes = String(inputDate.getMinutes()).padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
}
