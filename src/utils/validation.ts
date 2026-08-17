export const TIME_SLOTS = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export function getTodayValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isSlotPassed(date: string, time: string) {
  if (!date || !time) return false;

  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const slotDate = new Date(year, month - 1, day, hours, minutes || 0, 0);

  return slotDate.getTime() <= Date.now();
}

export function checkName(value: string) {
  const name = value.trim();

  if (!name) {
    return "Как к вам обращаться?";
  }

  if (name.length < 2) {
    return "Имя слишком короткое";
  }

  return null;
}

export function checkPhone(value: string) {
  // пробелы, скобки, дефисы
  const cleaned = value.replace(/[\s()\-]/g, "");
  const digits = cleaned.replace(/\D/g, "");

  if (!digits) {
    return "Укажите телефон";
  }

  // +7 или 8, потом 10 цифр
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
    return null;
  }

  return "Введите номер в формате +7XXXXXXXXXX или 8XXXXXXXXXX";
}

export function checkDate(value: string) {
  if (!value) {
    return "Выберите дату";
  }

  if (value < getTodayValue()) {
    return "Дата не может быть раньше сегодня";
  }

  return null;
}

export function checkTime(value: string, date: string) {
  if (!value) {
    return "Выберите время";
  }

  if (!TIME_SLOTS.includes(value)) {
    return "Выберите время из слотов";
  }

  if (date && isSlotPassed(date, value)) {
    return "Это время уже прошло";
  }

  return null;
}

export function checkGuests(value: string) {
  if (!value) {
    return "Сколько будет гостей?";
  }

  const n = Number(value);

  if (Number.isNaN(n) || n < 1 || n > 12) {
    return "Можно от 1 до 12 гостей";
  }

  return null;
}
