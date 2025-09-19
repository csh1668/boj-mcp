const numberToRome = (number: number) => {
  switch (number) {
    case 1: return "I";
    case 2: return "II";
    case 3: return "III";
    case 4: return "IV";
    case 5: return "V";
    default: return number.toString();
  }
}

export const levelToLabel = (level: number) => {
  if (level < 0) return "Unrated / Not Ratable";
  if (level <= 5) return `Bronze ${numberToRome(6 - level)}`;
  if (level <= 10) return `Silver ${numberToRome(11 - level)}`;
  if (level <= 15) return `Gold ${numberToRome(16 - level)}`;
  if (level <= 20) return `Platinum ${numberToRome(21 - level)}`;
  if (level <= 25) return `Diamond ${numberToRome(26 - level)}`;
  if (level <= 30) return `Ruby ${numberToRome(31 - level)}`;
  if (level == 31) return "Master";
  return "Unrated / Not Ratable";
}