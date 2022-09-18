import styles from "../../styles/ShiftsOverview.module.css";
import { useEffect, useState } from "react";
const { format } = require("date-fns");
import { da } from "date-fns/locale";

const ShiftsOverview = (props) => {
  const roster = props.roster;
  const initials = props.initials;
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (initials) {
      let tempShifts = [];

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

              tempShifts.push({
                date: day.date,
                shiftType,
                role: key,
              });
            }
          }
        });
      });

      console.log(tempShifts);

      setShifts(tempShifts);
    }
  }, [initials]);

  return (
    <div>
      {initials == undefined ||
        (initials == "" && (
          <div>
            <p>Indtast initialer først.</p>
          </div>
        ))}
      {initials != "" && initials != undefined && shifts.length != 0 && (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th className={styles.header}>Dato</th>
              <th className={styles.header}>Vagttype</th>
              <th className={styles.header}>Rolle</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {shifts.map((shift) => {
              return (
                <tr>
                  <td>
                    {format(shift.date, "EEEE", { locale: da })}{" "}
                    <span>
                      {format(shift.date, "dd. LLLL", { locale: da })}
                    </span>
                  </td>
                  <td>{shift.shiftType}</td>
                  <td>{shift.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {initials != "" && initials != undefined && shifts.length == 0 && (
        <p>Du har ingen vagter endnu...</p>
      )}
    </div>
  );
};

export default ShiftsOverview;
