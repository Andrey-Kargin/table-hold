import Head from "next/head";
import { useState } from "react";
import BookingForm from "../components/BookingForm";
import ConfirmationScreen from "../components/ConfirmationScreen";
import { BookingFormData } from "../types/booking";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [booking, setBooking] = useState<BookingFormData | null>(null);

  function handleSuccess(data: BookingFormData) {
    setBooking(data);
  }

  function handleAgain() {
    setBooking(null);
  }

  return (
    <>
      <Head>
        <title>Бронирование столика</title>
        <meta
          name="description"
          content="Выберите удобное время посещения и забронируйте стол"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg`} />
      </Head>

      <main className={styles.page}>
        <div className={styles.layout}>
          <section className={styles.intro}>
            <p className={styles.kicker}>01 / бронь</p>
            <h1 className={styles.title}>
              Столик
              <em>на визит</em>
            </h1>
            <p className={styles.note}>
              Выберите удобное для вас время посещения.{" "}
              <span className={styles.slots}>
                Слоты каждый час, с 12:00 до 22:00.
              </span>
            </p>
          </section>

          <section className={styles.panel}>
            <div className={styles.fade} key={booking ? "ok" : "form"}>
              {booking ? (
                <ConfirmationScreen booking={booking} onAgain={handleAgain} />
              ) : (
                <BookingForm onSuccess={handleSuccess} />
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
