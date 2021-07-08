/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import * as helpers from "../helpers";
import { EditIcon } from "../icons";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	TextField,
} from "@material-ui/core";
import IroColorPicker from "./IroColorPicker";

type Color = {
	edited: boolean;
	initialValue: string;
	onSelect: (value: string) => void; // Why would this be falsey?
};

const Color = ({
	edited,
	initialValue,
	onSelect,
}: Color): React.ReactElement => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		if (dialogOpen) {
			if (value.length === 7 || value.length === 4 || value.length === 9) {
				if (/#[0-9a-fA-F]*/.exec(value)) {
					// picker.setColors([value]);
				}
			}
		}
	}, [value]);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	// TODO register page view

	const close = (): void => {
		helpers.unback(close);
		setDialogOpen(false);
	};

	const select = (): void => {
		helpers.unback(close);
		if (value.length === 7 || value.length === 4 || value.length === 9) {
			if (/#[0-9a-fA-F]*/.exec(value)) {
				setDialogOpen(false);
				onSelect(value);
			}
		}
	};
	return (
		<React.Fragment>
			<div
				onClick={() => setDialogOpen(true)}
				style={{ display: "flex", alignItems: "center " }}
			>
				<Button
					style={{
						backgroundColor: value,
						color: helpers.brightnessByColor(value) < 127 ? "white" : "black",
						margin: "0px 8px",
					}}
				>
					{value}
				</Button>

				{edited ? (
					<div style={{ color: "#281A1A" }}>
						<EditIcon />
					</div>
				) : (
					""
				)}
			</div>
			<Dialog
				onEntered={helpers.genOnback(close)}
				open={dialogOpen}
				disableBackdropClick={false}
				onClose={close}
			>
				<DialogContent>
					{dialogOpen && (
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
		</React.Fragment>
	);
};

export default Color;
