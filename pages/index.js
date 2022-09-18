import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Roster from "../components/Roster/Roster";
import ShiftsOverview from "../components/ShiftsOverview/ShiftsOverview";

const xlsx = require("xlsx");
const axios = require("axios");
const { utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");
const { parse, format, getDay } = require("date-fns");

const parseWithTimeZone = (dateStr, formatStr, referenceDate, timeZone) => {
  const zonedDate = utcToZonedTime(referenceDate, timeZone);
  const parsedDate = parse(dateStr, formatStr, zonedDate);
  return zonedTimeToUtc(parsedDate, timeZone);
};

const xlsxToJson = async (fileURL, sheetName) => {
  let res = await axios.get(fileURL).catch((err) => console.log(err));

  res.data = res.data.replace(/ø/g, "oe"); // xlsx module doesn't work with special characters like ø
  res.data = res.data.replace(/Ø/g, "OE");
  // res.data = res.data.replace(
  //   /<span style="font-weight:bold;">/g,
  //   '<span style="font-weight:bold;"><span>&nbsp;</span>'
  // ); // Formatting issue
  res.data = res.data.replace(/<\/?span[^>]*>/g, ""); // Formatting issue

  const workbook = xlsx.read(res.data, { type: "binary" });
  const sheet = workbook.Sheets["Sheet1"];
  return xlsx.utils.sheet_to_json(sheet, { defval: "", raw: false });
};

const convertData = (jsonSheet) => {
  let roster = {
    januar: [],
    februar: [],
    marts: [],
    april: [],
    maj: [],
    juni: [],
    juli: [],
    august: [],
    september: [],
    oktober: [],
    november: [],
    december: [],
  };
  let rawRoster = [];

  let counter = 0;
  let monthCounter = 0;
  let monthIndexes = [];
  for (let columnIndex in Object.keys(jsonSheet)) {
    const column = jsonSheet[columnIndex];
    const months = [
      "Januar",
      "Februar",
      "Marts",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "December",
    ];
    if (counter < 1) {
      let currentIndex = 0;
      let prevMonthIndex = 0;
      let prevMonthVal = "";
      Object.entries(column).forEach(([key, value]) => {
        if (months[monthCounter] == value) {
          ++monthCounter;
          if (monthIndexes.length != 0)
            monthIndexes.push({
              startNum: prevMonthIndex,
              endNum: currentIndex,
              start: prevMonthVal,
              end: key,
              month: value,
            });
          else
            monthIndexes.push({
              startNum: currentIndex,
              endNum: currentIndex,
              start: key,
              end: key,
              month: value,
            });
          prevMonthIndex = currentIndex;
          prevMonthVal = key;
        }
        ++currentIndex;
      });
    } else {
      for (let i = 0; i < monthIndexes.length; ++i) {
        Object.entries(column).forEach(([key, value]) => {
          if (monthIndexes[i].end == key) {
            let piccolo = "";
            let billet = "";
            let kiosk = "";
            let operatoer = "";
            let loops = 0;
            let currentValueIndex = Object.values(column).indexOf(value);

            if (currentValueIndex) {
              // endNum
              if (i < monthIndexes.length - 1) {
                loops = monthIndexes[i + 1].endNum - monthIndexes[i].endNum;
              } else {
                loops = 62 - monthIndexes[i].endNum;
              }

              for (let j = 1; j < loops; ++j) {
                let positionVal = Object.values(jsonSheet[0])[
                  currentValueIndex + j
                ];
                let val = Object.values(column)[currentValueIndex + j];
                if (!val) val = "";

                if (positionVal.toLowerCase() == "piccolo") piccolo = val;
                if (positionVal.toLowerCase() == "billet") billet = val;
                if (positionVal.toLowerCase() == "kiosk") kiosk = val;
                if (positionVal.toLowerCase() == "operatoer") operatoer = val;
              }
            }

            if (value.substr(value.length - 3) == "/22")
              value =
                value.slice(0, value.length - 2) +
                "20" +
                value.slice(value.length - 2);

            if (value != "")
              roster[Object.keys(roster)[i]].push({
                date: parseWithTimeZone(value, "dd/MM/yyyy", new Date(), "UTC"),
                piccolo,
                billet,
                kiosk,
                operatoer,
              });
          }
        });
      }
    }
    ++counter;
  }

  Object.entries(roster).forEach(([key, value]) => {
    value.forEach((day) => {
      rawRoster.push(day);
    });
  });

  return rawRoster;
};

const main = async () => {
  const jsonSheet = await xlsxToJson(
    "https://docs.google.com/spreadsheets/d/180yb3QwmEOzfUXmDA8ygcFeXc8iO1AQ8D9OwtQ2g4TE/htmlview?authkey=CMvL_6MD&hl=en&fbclid=IwAR2_l0nK2LNGd98mR4RCYFwONj1lfH_UXBbDNqW_x17sjUc1R30BqWbPTOQ#gid=0",
    "Vagtplan 2022"
  );

  convertData(jsonSheet);
};

main();

export default function Home() {
  const [roster, setRoster] = useState([]);
  const [weekRoster, setWeekRoster] = useState([]);
  const [weekIndex, setWeekIndex] = useState([]);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const main = async () => {
      const jsonSheet = await xlsxToJson(
        "https://docs.google.com/spreadsheets/d/180yb3QwmEOzfUXmDA8ygcFeXc8iO1AQ8D9OwtQ2g4TE/htmlview?authkey=CMvL_6MD&hl=en&fbclid=IwAR2_l0nK2LNGd98mR4RCYFwONj1lfH_UXBbDNqW_x17sjUc1R30BqWbPTOQ#gid=0",
        "Vagtplan 2022"
      );

      setRoster(convertData(jsonSheet));
    };

    main();
  }, []);

  useEffect(() => {
    const currentDay = format(new Date(), "dd/MM/yyyy");

    let tempWeekRoster = [];
    let lastWeek = "";
    let week = [];

    roster.forEach((day, i) => {
      if (currentDay == format(day.date, "dd/MM/yyyy")) {
        setWeekIndex(tempWeekRoster.length);
      }

      week.push(day);

      if (getDay(new Date(day.date)) == 0 || roster.length - 1 == i) {
        tempWeekRoster.push(week);
        week = [];
      }
    });

    setWeekRoster(tempWeekRoster);
  }, [roster]);

  const handleInitialsChange = (event) => {
    setInitials(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>Bio silkeborg | vagtplan</title>
        <meta name="description" content="Vagtplan for Silkeborg bio" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Vagtplan</h1>
        <hr className={styles.titleLine} />
        <div className={styles.initialsBox}>
          <h3 className={styles.initialsHeader}>
            Indtast initialer for at finde dine vagter:
          </h3>
          <input
            value={initials}
            onChange={(event) => handleInitialsChange(event)}
            className={styles.initialsInput}
            placeholder="Initialer..."
            maxLength="2"
          />
        </div>
        <h2 className={styles.subtitle}>Skema</h2>
        {weekRoster.length != 0 && weekIndex.length != 0 && (
          <Roster
            weekRoster={weekRoster}
            weekIndex={weekIndex}
            initials={initials}
          />
        )}
        <h2 className={styles.subtitle}>Overblik</h2>
        {roster.length != 0 && (
          <ShiftsOverview roster={roster} initials={initials} />
        )}
      </main>
      <footer className={styles.footer}>
        <p>
          Lavet af Matthias Jensen | copyright &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
