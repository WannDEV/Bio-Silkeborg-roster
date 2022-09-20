import styles from "../../styles/ShiftsOverview.module.css";
import { useEffect, useState } from "react";
const { format } = require("date-fns");
import { da } from "date-fns/locale";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import IconButton from "@mui/material/IconButton";

const ShiftsOverview = (props) => {
  const roster = props.roster;
  const initials = props.initials;
  const [shifts, setShifts] = useState([]);
  const [shiftsIndex, setShiftsIndex] = useState([]);
  const [nextShift, setNextShift] = useState([]);
  const [chunkSize, setChunkSize] = useState(8);

  useEffect(() => {
    if (initials) {
      let tempShifts = [];
      let shiftsArray = [];

      console.log(initials);

      roster.forEach((day) => {
        Object.entries(day).forEach(([key, value]) => {
          if (typeof value == "string" && value != "") {
            let words = value
              .toUpperCase()
              .replaceAll("Ø", "OE")
              .match(/\b(\w+)\b/g);

            if (words.includes(initials.toUpperCase()) == true) {
              let shiftType = "";

              // logic to determine type of shift
              if (words.length == 1) shiftType = "Heldagsvagt";
              if (value.includes("(")) {
                let i = value.indexOf("(") + 1;
                if (value.substring(i, i + 2) == initials.toUpperCase())
                  shiftType = "Bagvagt";
                else shiftType = "Heldagsvagt";
              }
              if (value.includes("/") && !value.includes("+")) {
                let i = value.indexOf("/");

                if (value.substring(i - 2, i) == initials.toUpperCase())
                  shiftType = "Morgenvagt";
                if (value.substring(i + 1, i + 3) == initials.toUpperCase())
                  shiftType = "Aftenvagt";
              }
              if (value.includes("+") && !value.includes("/"))
                shiftType = "Heldagsvagt (Oplæring)";
              if (value.includes("+") && value.includes("/")) {
                if (
                  value
                    .split("/")[0]
                    .match(/\b(\w+)\b/g)
                    .includes(initials.toUpperCase())
                )
                  shiftType = "Morgenvagt (oplæring)";
                if (value.indexOf("/") - value.indexOf("+") < 0)
                  shiftType = "Morgenvagt";

                if (
                  value
                    .split("/")[1]
                    .match(/\b(\w+)\b/g)
                    .includes(initials.toUpperCase())
                )
                  shiftType = "Aftenvagt (oplæring)";
                if (value.indexOf("/") - value.indexOf("+") > 0)
                  shiftType = "Aftenvagt";
              }
              if (!value.includes("/") && !value.includes("+"))
                shiftType = "Heldagsvagt";
              if (value.split("/").length >= 3) shiftType = "Kort vagt";

              if (shiftType.length == 0) shiftType = "Udefineret";

              shiftsArray.push(day);
              tempShifts.push({
                date: day.date,
                shiftType,
                role: key,
              });
            }
          }
        });
      });

      let sortedShifts = [];

      for (let i = 0; i < tempShifts.length; i += chunkSize) {
        const chunk = tempShifts.slice(i, i + chunkSize);
        sortedShifts.push(chunk);
      }

      const tempShiftsIndex = shiftsArray.findIndex(
        (shift) => shift.date > new Date().setHours(0, 0, 0, 0)
      );

      setShifts(sortedShifts);
      setShiftsIndex(Math.floor(tempShiftsIndex / chunkSize));
      setNextShift(shiftsArray[tempShiftsIndex]);
    }
  }, [initials]);

  const pageBeginning = () => {
    setShiftsIndex(0);
  };

  const pageBackward = () => {
    setShiftsIndex(shiftsIndex - 1);
  };

  const pageForward = () => {
    setShiftsIndex(shiftsIndex + 1);
  };

  const pageEnding = () => {
    setShiftsIndex(shifts.length - 1);
  };

  return (
    <div className={styles.box}>
      {initials == undefined ||
        (initials == "" && (
          <div className={styles.noShiftsBox}>
            <p className={styles.noShiftsText}>
              Indtast initialer først for at se denne sektion.
            </p>
          </div>
        ))}
      {initials != "" && initials != undefined && shifts.length != 0 && (
        <div>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th className={styles.header}>Dato</th>
                <th className={styles.header}>Vagttype</th>
                <th className={styles.header}>Rolle</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {shiftsIndex.length != 0 &&
                shifts.length != 0 &&
                nextShift.length != 0 &&
                shifts[shiftsIndex].map((shift, i) => {
                  return (
                    <tr
                      style={{
                        backgroundColor:
                          shift.date == nextShift.date ? "#C4B454" : "",
                      }}
                      key={i}
                    >
                      <td className={styles.td}>
                        {format(shift.date, "EEEE", { locale: da })}{" "}
                        <span className={styles.dateSpan}>
                          {format(shift.date, "dd. LLLL", { locale: da })}
                        </span>
                      </td>
                      <td className={styles.td}>{shift.shiftType}</td>
                      <td className={styles.td}>{shift.role}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className={styles.rosterNavigation}>
            <IconButton
              aria-label="Page beginning"
              onClick={pageBeginning}
              color="inherit"
              disabled={shiftsIndex == 0}
            >
              <KeyboardDoubleArrowLeftIcon
                className={styles.arrows}
                style={{
                  marginRight: "0.4rem",
                  color: shiftsIndex == 0 ? "#808080" : "#fff",
                }}
              />
            </IconButton>
            <IconButton
              aria-label="Page backward"
              onClick={pageBackward}
              color="inherit"
              disabled={shiftsIndex == 0}
            >
              <ArrowBackIosIcon
                className={styles.arrows}
                style={{ color: shiftsIndex == 0 ? "#808080" : "#fff" }}
              />
            </IconButton>
            <p>
              Side {shiftsIndex + 1} ud af {shifts.length}
            </p>
            <IconButton
              aria-label="Page forward"
              onClick={pageForward}
              color="inherit"
              disabled={shiftsIndex == shifts.length - 1}
            >
              <ArrowForwardIosIcon
                className={styles.arrows}
                style={{
                  marginLeft: "0.4rem",
                  color: shiftsIndex == shifts.length - 1 ? "#808080" : "#fff",
                }}
              />
            </IconButton>
            <IconButton
              aria-label="Page ending"
              onClick={pageEnding}
              color="inherit"
              disabled={shiftsIndex == shifts.length - 1}
            >
              <KeyboardDoubleArrowRightIcon
                className={styles.arrows}
                style={{
                  color: shiftsIndex == shifts.length - 1 ? "#808080" : "#fff",
                }}
              />
            </IconButton>
          </div>
        </div>
      )}
      {initials != "" && initials != undefined && shifts.length == 0 && (
        <p>Du har ingen vagter endnu...</p>
      )}
    </div>
  );
};

export default ShiftsOverview;
