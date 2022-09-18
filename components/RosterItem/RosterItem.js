import styles from "../../styles/RosterItem.module.css";
const { getDay, format } = require("date-fns");
import { da } from "date-fns/locale";

const RosterItem = (props) => {
  const day = props.day;
  const initials = props.initials.toUpperCase();

  const includesInitials = (str) => {
    if (str == "" || initials == "") return false;

    return str
      .toUpperCase()
      .replaceAll("ø", "oe")
      .match(/\b(\w+)\b/g)
      .includes(initials);
  };

  const dayOfWeek = [
    "Søndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
  ][getDay(new Date(day.date))];

  return (
    <div className={styles.rosterItem}>
      <div
        className={styles.headerBox}
        style={{
          backgroundColor:
            format(new Date(), "dd/MM/yyyy") == format(day.date, "dd/MM/yyyy")
              ? "#920300"
              : "#808080",
        }}
      >
        <h3 className={styles.header}>{dayOfWeek}</h3>
        <p className={styles.subHeader}>
          {format(day.date, "dd") +
            ". " +
            format(day.date, "LLLL", { locale: da })}
        </p>
      </div>
      <p className={styles.roleTitle}>Billet</p>
      <p
        style={{
          color: day.billet ? "#fff" : "#808080",
          backgroundColor: includesInitials(day.billet) ? "#C4B454" : "",
        }}
        className={styles.roleInitials}
      >
        {day.billet.toUpperCase().replaceAll("MOEDE", "MØDE") || "Udefineret"}
      </p>
      <p className={styles.roleTitle}>Kiosk</p>
      <p
        style={{
          color: day.kiosk ? "#fff" : "#808080",
          backgroundColor: includesInitials(day.kiosk) ? "#C4B454" : "",
        }}
        className={styles.roleInitials}
      >
        {day.kiosk.toUpperCase().replaceAll("MOEDE", "MØDE") || "Udefineret"}
      </p>
      <p className={styles.roleTitle}>Piccolo</p>
      <p
        style={{
          color: day.piccolo ? "#fff" : "#808080",
          backgroundColor: includesInitials(day.piccolo) ? "#C4B454" : "",
        }}
        className={styles.roleInitials}
      >
        {day.piccolo.toUpperCase().replaceAll("MOEDE", "MØDE") || "Udefineret"}
      </p>
      <p className={styles.roleTitle}>Operatør</p>
      <p
        style={{
          color: day.operatoer ? "#fff" : "#808080",
          backgroundColor: includesInitials(day.operatoer) ? "#C4B454" : "",
        }}
        className={styles.roleInitials}
      >
        {day.operatoer.toUpperCase().replaceAll("MOEDE", "MØDE") ||
          "Udefineret"}
      </p>
    </div>
  );
};

export default RosterItem;
