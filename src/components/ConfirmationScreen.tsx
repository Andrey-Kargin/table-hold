import { BookingFormData } from "../types/booking";
import styles from "./ConfirmationScreen.module.css";

interface ConfirmationScreenProps {
  booking: BookingFormData;
  onAgain: () => void;
}

function formatDate(value: string) {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function guestsText(n: number) {
  if (n === 1) return "1 гость";
  if (n >= 2 && n <= 4) return `${n} гостя`;
  return `${n} гостей`;
}

function ConfirmationScreen({ booking, onAgain }: ConfirmationScreenProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.kicker}>подтверждено</p>
      <h2 className={styles.title}>Ждём вас, {booking.name}</h2>
      <p className={styles.lead}>Бронь собрали, стол держим.</p>

      {/* сводка */}
      <ul className={styles.list}>
        <li>
          <span>Дата</span>
          <strong>{formatDate(booking.date)}</strong>
        </li>
        <li>
          <span>Время</span>
          <strong>{booking.time}</strong>
        </li>
        <li>
          <span>Гостей</span>
          <strong>{guestsText(booking.guests)}</strong>
        </li>
      </ul>

      <button className={styles.again} type="button" onClick={onAgain}>
        Забронировать ещё
      </button>
    </div>
  );
}

export default ConfirmationScreen;
