import React from "react";
import * as helpers from "../helpers";

import { makeStyles, Theme, Typography } from "@material-ui/core";
import { alpha } from '@material-ui/core/styles';

interface StyleProps {
	selfish: boolean,
	bright: boolean,
	color: string,
}

interface ChatMessageProps {
	selfish: boolean;
	name: string;
	nation: string;
	text: string;
	time: string;
	undelivered: boolean;
	avatar: React.ReactElement;
	color: string;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
	root: {
		display: "flex",
		width: `calc(100%-${theme.spacing(2)}px)`,
		maxWidth: "960px",  // TODO remove hardcoding
		backgroundColor: theme.palette.background.paper,
		alignItems: "flex-start",
		margin: theme.spacing(1),
		flexDirection: ({ selfish }) => selfish ? "row-reverse" : "row",
		gap: theme.spacing(1),
	},
	messageContainer: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: ({ color }) => color + "19",
		borderRadius: ({ selfish }) => selfish ? theme.spacing(1.5, 0, 1.5, 1.5) : theme.spacing(0, 1.5, 1.5, 1.5),
		maxWidth: "calc(100% - 70px)",  // TODO remove hardcoding
		border: ({ bright, color }) => bright ? "1px solid " + color : "none",
		padding: theme.spacing(1),
	},
	name: {
		fontWeight: theme.typography.fontWeightBold,
	},
	text: {
		whiteSpace: "pre-wrap",
		maxWidth: "100%",
		fontSize: "14px",
	},
	status: {
		alignSelf: "flex-end",
		color: alpha(theme.palette.text.primary, 0.3)
	}
}))

const ChatMessage = ({ selfish, name, nation, text, time, undelivered, avatar, color }: ChatMessageProps): React.ReactElement => {
	const bright = Boolean((helpers.brightnessByColor(color) || 0) > 128);
	const classes = useStyles({ selfish, bright, color });
	return (
		<div className={classes.root}>
			<div>{avatar}</div>
			<div className={classes.messageContainer}>
				<Typography variant={"subtitle2"} className={classes.name}>
					{name} {nation}
				</Typography>
				<Typography className={classes.text}>
					{helpers.linkify(text)}
				</Typography>
				<Typography variant={"caption"} className={classes.status}>
					{undelivered ? "Sending..." : time}
				</Typography>
			</div>
		</div>
	);
}

export default ChatMessage;
