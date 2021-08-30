import { Typography } from "@material-ui/core";
import React from "react";

interface ChatPhaseDividerProps {
  phase: string;
}

const ChatPhaseDivider = ({
  phase,
}: ChatPhaseDividerProps): React.ReactElement => {
  const dividerSymbol = "------";
  return (
    <Typography color="primary" display="block" variant="subtitle2">
      {`${dividerSymbol} ${phase} ${dividerSymbol}`}
    </Typography>
  );
};

export default ChatPhaseDivider;
