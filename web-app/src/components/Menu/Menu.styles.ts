import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => {
  return {
    bufferDiv: {
      width: "220px",
    },
    link: {
      color: theme.palette.text.primary,
    },
    header: {
      padding: theme.spacing(3, 2, 1, 2),
      height: theme.spacing(5),
      "& span": {
        color: theme.palette.text.disabled,
        minHeight: "auto",
        minWidth: "auto",
        font: "500 14px / 48px Cabin, Roboto, sans-serif",
        margin: theme.spacing(0, 0.25, 0.25),
      },
    },
    iconLinks: {
      display: "Flex",
      justifyContent: "space-around",
      padding: theme.spacing(0, 1),
      "& a": {
        color: theme.palette.text.primary,
      },
    },
  };
});
