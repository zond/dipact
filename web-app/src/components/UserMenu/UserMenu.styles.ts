import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => {
  return {
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      border: `1px solid ${theme.palette.secondary.main}`,
    },
    email: {
      fontWeight: "bold",
    },
  };
});
