import { IconButton, TextField, Typography, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { SendMessageIcon } from "../icons";

interface ChatMessageInputProps {
  onSendMessage: (message: string) => void;
}

const useStyles = makeStyles((theme) => ({
    root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
    },
	subDiv: {
		display: "flex",
		alignItems: "flex-start",
		width: "100%",
	},
    input: {
	    flexGrow: 100,
    },
    prompt: {
        marginRight: theme.spacing(7),
    }
}))

const SEND_PROMPT = "Ctrl + Enter to send";

const ChatMessageInput = ({ onSendMessage }: ChatMessageInputProps): React.ReactElement => {
  const classes = useStyles();
  const [message, setMessage] = useState("");

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
	if (e.key === "Enter" && e.ctrlKey) {
		e.stopPropagation();
		e.preventDefault();
		onSendMessage(message);
	}
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  const sendMessage = (): void => {
	  if (!message) return;
	  onSendMessage(message);
  }

  return (
	<div className={classes.root}>
		<div className={classes.subDiv}>
			<TextField
				id="chat-channel-input-field"
				multiline
				rows="2"
				className={classes.input}
				label="Message"
				variant="outlined"
				onKeyDown={onKeyDown}
				onChange={onChange}
				value={message}
			/>
			<IconButton
				onClick={sendMessage}
				color="primary"
			>
				<SendMessageIcon />
			</IconButton>
		</div>
		<Typography className={classes.prompt} variant="caption">
            {SEND_PROMPT}
		</Typography>
	</div>
  );
};

export default ChatMessageInput;
