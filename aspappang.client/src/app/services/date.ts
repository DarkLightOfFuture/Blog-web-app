export function createPubDate(date: string) {
  const d = new Date(date);

  const mths = func(d.getMonth(), 1);
  const mins = func(d.getMinutes());

  return `${d.getDate()}.${mths}.${d.getFullYear()} ${d.getHours()}:${mins}`;

  function func(numb: number, offset: number = 0) {
    if (numb < 10) {
      return `0${numb + offset}`
    }
    else {
      return numb.toString();
    }
  }
}
