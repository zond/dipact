import { Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";

interface ChatMessageWithAvatarProps {
  children: React.ReactNode;
  selfish: boolean;
}
interface StyleProps {
  selfish: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.background.paper,
    alignItems: "flex-start",
    margin: theme.spacing(1),
    flexDirection: ({ selfish }) => (selfish ? "row-reverse" : "row"),
    gap: theme.spacing(1),
  },
}));

const ChatMessageWithAvatar = ({
  children,
  selfish,
}: ChatMessageWithAvatarProps): React.ReactElement => {
  const classes = useStyles({ selfish });

  return <div className={classes.root}>{children}</div>;
};
export default ChatMessageWithAvatar;
