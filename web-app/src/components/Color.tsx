import React, { useEffect, useState } from "react";
import * as helpers from "../helpers";
import { EditIcon } from "../icons";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	makeStyles,
	TextField,
	Theme,
} from "@material-ui/core";
import IroColorPicker from "./IroColorPicker";

type Color = {
	edited: boolean;
	initialValue: string;
	onSelect: (value: string) => void;
};

interface StyleProps {
	value: string;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => {
	return {
		root: {
			display: "flex",
			alignItems: "center",
		},
		button: {
			backgroundColor: ({ value }) => value,
			color: ({ value }) => theme.palette.getContrastText(value),
			margin: theme.spacing(0, 1),
		},
		editIcon: {
			color: theme.palette.primary.main,
		},
	};
});

const Color = ({
	edited,
	initialValue,
	onSelect,
}: Color): React.ReactElement => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(initialValue);
	const classes = useStyles({ value });

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const close = (): void => {
		helpers.unback(close);
		setOpen(false);
	};

	const select = (): void => {
		helpers.unback(close);
		if (value.length === 7 || value.length === 4 || value.length === 9) {
			if (/#[0-9a-fA-F]*/.exec(value)) {
				setOpen(false);
				onSelect(value);
			}
		}
	};
	return (
		<>
			<div className={classes.root}>
				<Button onClick={() => setOpen(true)} className={classes.button}>
					{value}
				</Button>
				{edited && (
					<div className={classes.editIcon}>
						<EditIcon />
					</div>
				)}
			</div>
			<Dialog
				onEntered={helpers.genOnback(close)}
				open={open}
				disableBackdropClick={false}
				onClose={close}
			>
				<DialogContent>
					{open && (
						<IroColorPicker
							onColorChange={setValue}
							width={208}
							color={value}
						/>
					)}
					<TextField
						key="hex"
						label="Hexcode"
						margin="dense"
						fullWidth
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={select} color="primary">
						Select
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Color;
