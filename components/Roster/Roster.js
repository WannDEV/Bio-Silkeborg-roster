import { useState } from "react";
import RosterItem from "../RosterItem/RosterItem";
import styles from "../../styles/Roster.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import TodayIcon from "@mui/icons-material/Today";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

const Roster = (props) => {
  const [weekRoster, setWeekRoster] = useState(props.weekRoster);
  const [weekIndex, setWeekIndex] = useState(props.weekIndex);
  const initials = props.initials;

  const pageBeginning = () => {
    setWeekIndex(0);
  };

  const pageBackward = () => {
    setWeekIndex(weekIndex - 1);
  };

  const pageForward = () => {
    setWeekIndex(weekIndex + 1);
  };

  const pageEnding = () => {
    setWeekIndex(weekRoster.length - 1);
  };

  return (
    <div>
      <div className={styles.roster}>
        {weekRoster.length != 0 &&
          weekIndex.length != 0 &&
          weekRoster[weekIndex].map((day, i) => (
            <RosterItem
              day={day}
              initials={initials}
              key={i}
              todayRef={props.todayRef}
            />
          ))}
      </div>
      <div className={styles.rosterOuterNavigation}>
        <div className={styles.rosterNavigation}>
          <IconButton
            aria-label="Page beginning"
            onClick={pageBeginning}
            color="inherit"
            disabled={weekIndex == 0}
          >
            <KeyboardDoubleArrowLeftIcon
              className={styles.arrows}
              style={{
                marginRight: "0.4rem",
                color: weekIndex == 0 ? "#808080" : "#fff",
              }}
            />
          </IconButton>
          <IconButton
            aria-label="Page backward"
            onClick={pageBackward}
            color="inherit"
            disabled={weekIndex == 0}
          >
            <ArrowBackIosIcon
              className={styles.arrows}
              style={{ color: weekIndex == 0 ? "#808080" : "#fff" }}
            />
          </IconButton>
          <p>
            Side {weekIndex + 1} ud af {weekRoster.length}
          </p>
          <IconButton
            aria-label="Page forward"
            onClick={pageForward}
            color="inherit"
            disabled={weekIndex == weekRoster.length - 1}
          >
            <ArrowForwardIosIcon
              className={styles.arrows}
              style={{
                marginLeft: "0.4rem",
                color: weekIndex == weekRoster.length - 1 ? "#808080" : "#fff",
              }}
            />
          </IconButton>
          <IconButton
            aria-label="Page ending"
            onClick={pageEnding}
            color="inherit"
            disabled={weekIndex == weekRoster.length - 1}
          >
            <KeyboardDoubleArrowRightIcon
              className={styles.arrows}
              style={{
                color: weekIndex == weekRoster.length - 1 ? "#808080" : "#fff",
              }}
            />
          </IconButton>
        </div>
        <Button
          aria-label="Page today"
          onClick={() => {
            setWeekIndex(props.weekIndex);
          }}
          disabled={weekIndex == props.weekIndex}
          variant="outlined"
          sx={{
            border:
              weekIndex == props.weekIndex
                ? "1px #808080 solid !important"
                : "1px #fff solid !important",
            marginBottom: "2rem",
          }}
        >
          <p
            className={styles.todayButtonText}
            style={{ color: weekIndex == props.weekIndex ? "#808080" : "#fff" }}
          >
            Denne uge
          </p>
          <TodayIcon
            className={styles.todayButtonIcon}
            sx={{
              color: weekIndex == props.weekIndex ? "#808080" : "#fff",
            }}
            fontSize="small"
          />
        </Button>
      </div>
    </div>
  );
};

export default Roster;
