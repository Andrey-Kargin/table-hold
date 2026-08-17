import { FormEvent, useEffect, useRef, useState } from "react";
import { BookingFormData, BookingStatus, FormErrors } from "../types/booking";
import {
  TIME_SLOTS,
  checkDate,
  checkGuests,
  checkName,
  checkPhone,
  checkTime,
  getTodayValue,
  isSlotPassed,
} from "../utils/validation";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  onSuccess: (data: BookingFormData) => void;
}

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FieldSelectProps {
  value: string;
  placeholder: string;
  options: Option[];
  invalid?: boolean;
  onChange: (value: string) => void;
}

function FieldSelect({
  value,
  placeholder,
  options,
  invalid,
  onChange,
}: FieldSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = options.find((item) => item.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef}>
      <button
        type="button"
        className={`${styles.selectBtn} ${invalid ? styles.invalid : ""}`}
        data-open={open ? "true" : "false"}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={current ? undefined : styles.placeholder}>
          {current ? current.label : placeholder}
        </span>
      </button>

      {open && (
        <ul className={styles.menu}>
          {options.map((item) => (
            <li key={item.value || "empty"}>
              <button
                type="button"
                data-option="true"
                data-active={item.value === value ? "true" : "false"}
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BookingForm({ onSuccess }: BookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [minDate, setMinDate] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<BookingStatus>("idle");

  useEffect(() => {
    setMinDate(getTodayValue());
  }, []);

  function validateField(field: string, value: string, nextDate = date) {
    if (field === "name") return checkName(value);
    if (field === "phone") return checkPhone(value);
    if (field === "date") return checkDate(value);
    if (field === "time") return checkTime(value, nextDate);
    if (field === "guests") return checkGuests(value);
    return null;
  }

  function setFieldError(field: string, value: string) {
    const message = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (status === "loading") return;

    const nextErrors: FormErrors = {
      name: checkName(name) || undefined,
      phone: checkPhone(phone) || undefined,
      date: checkDate(date) || undefined,
      time: checkTime(time, date) || undefined,
      guests: checkGuests(guests) || undefined,
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;

    setStatus("loading");

    setTimeout(() => {
      onSuccess({
        name: name.trim(),
        phone: phone.trim(),
        date,
        time,
        guests: Number(guests),
      });
    }, 1500);
  }

  const loading = status === "loading";

  const timeOptions: Option[] = TIME_SLOTS.map((slot) => ({
    value: slot,
    label: slot,
    disabled: Boolean(date) && isSlotPassed(date, slot),
  }));

  const guestOptions: Option[] = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* поле: имя */}
      <label className={styles.field}>
        <span>Имя гостя</span>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Анна"
          autoComplete="name"
          className={errors.name ? styles.invalid : undefined}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setFieldError("name", e.target.value);
          }}
          onBlur={(e) => setFieldError("name", e.target.value)}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}
      </label>

      {/* поле: телефон */}
      <label className={styles.field}>
        <span>Телефон</span>
        <input
          type="tel"
          name="phone"
          value={phone}
          placeholder="+7 999 123 45 67"
          autoComplete="tel"
          inputMode="tel"
          className={errors.phone ? styles.invalid : undefined}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setFieldError("phone", e.target.value);
          }}
          onBlur={(e) => setFieldError("phone", e.target.value)}
        />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
      </label>

      <div className={styles.row}>
        {/* поле: дата */}
        <label className={styles.field}>
          <span>Дата</span>
          <input
            type="date"
            name="date"
            value={date}
            min={minDate}
            className={errors.date ? styles.invalid : undefined}
            onChange={(e) => {
              const nextDate = e.target.value;
              const dateMessage = checkDate(nextDate);
              const timePassed = Boolean(time) && isSlotPassed(nextDate, time);

              setDate(nextDate);
              if (timePassed) setTime("");

              setErrors((prev) => ({
                ...prev,
                date: dateMessage || undefined,
                time: timePassed ? "Это время уже прошло" : prev.time,
              }));
            }}
            onBlur={(e) => setFieldError("date", e.target.value)}
          />
          {errors.date && <p className={styles.error}>{errors.date}</p>}
        </label>

        {/* поле: время */}
        <div className={styles.field}>
          <span>Время</span>
          <FieldSelect
            value={time}
            placeholder="слот"
            invalid={Boolean(errors.time)}
            options={timeOptions}
            onChange={(value) => {
              setTime(value);
              setFieldError("time", value);
            }}
          />
          {errors.time && <p className={styles.error}>{errors.time}</p>}
        </div>
      </div>

      {/* поле: гости */}
      <div className={styles.field}>
        <span>Гостей</span>
        <FieldSelect
          value={guests}
          placeholder="сколько человек"
          invalid={Boolean(errors.guests)}
          options={guestOptions}
          onChange={(value) => {
            setGuests(value);
            setFieldError("guests", value);
          }}
        />
        {errors.guests && <p className={styles.error}>{errors.guests}</p>}
      </div>

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className={styles.spinner} />
            Бронирую...
          </>
        ) : (
          "Забронировать стол"
        )}
      </button>
    </form>
  );
}

export default BookingForm;
