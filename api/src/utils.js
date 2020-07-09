export const buffToInts = (buff) => {
  const arr = [];
  for (let i = 1; i < buff.length; i += 3) {
    const value = (buff[i] << 16) | (buff[i + 1] << 8) | buff[i + 2];
    arr.push((value >> 12) & 0xfff);
    arr.push(value & 0xfff);
  }

  if ((buff.length - 1) % 3 == 2) {
    const j = buff.length - 2;
    const value = (buff[j] << 8) | buff(j + 1);
    arr.push(value >> 4);
  }

  return arr;
};

export const addMinutes = (date, min) => {
  return new Date(date.getTime() + min * 60000);
};
