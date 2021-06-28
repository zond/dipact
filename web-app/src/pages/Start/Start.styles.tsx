import { makeStyles } from "@material-ui/core/styles";

import SoldiersSVGString from "../../assets/img/soldiers.svg";

export default makeStyles((theme) => {
  return {
    list: {
      maxWidth: "940px", // TODO global value?
      margin: "auto",
    },
    listSubheaderContainer: {
      display: "flex",
      justifyContent: "space-between",
      paddingRight: theme.spacing(1),
    },
    listSubheader: {
      backgroundColor: theme.palette.background.paper,
      zIndex: 2,
      marginBottom: theme.spacing(0.25),
      height: theme.spacing(6),
      color: theme.palette.text.secondary, // TODO move to theme? #271919
    },
    listItem: {
      padding: theme.spacing(0, 2, 0.5, 2),
      width: "100%",
    },
    rulesContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100vh",
      backgroundColor: "#FDE2B5", // TODO move to theme
    },
    rulesInnerContainer: {
      margin: "auto",
      width: "100%",
      maxWidth: "400px", // TODO global value?
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
    },
    logoSvg: {
      margin: theme.spacing(3),
    },
    readTheRulesButton: {
      color: theme.palette.text.primary,
      margin: `${String(theme.spacing(2))}px auto`,
      minWidth: "200px", // TODO global value?
    },
    soldiersSvgDiv: {
      backgroundImage: `url(${SoldiersSVGString})`,
      height: "72px",
    },
    toolbar: {
      flexDirection: "column",
      "& button": {
        margin: theme.spacing(0.5),
        color: theme.palette.secondary.main,
      },
    },
    welcomeMessage: {
      margin: theme.spacing(0, 2, 0, 2),
    },
    bottomSection: {
      backgroundColor: theme.palette.primary.main,
      display: "flex",
      flexDirection: "column",
      paddingBottom: theme.spacing(3),

      "& button": {
        margin: `${String(theme.spacing(0.5))}px auto`,
        color: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        minWidth: "200px",
      },
    },
  };
});
