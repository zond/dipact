import React, { useEffect, useState } from "react";
import {
	InputLabel,
	Select,
	MenuItem,
	Typography,
	makeStyles,
	FormControl,
	IconButton,
} from "@material-ui/core";
import Color from "../components/Color";
import { DeleteIcon } from "../icons";

export interface ColorMap {
	[key: string]: {
		name: string;
		color: string;
		edited: boolean;
	}[];
}
interface NationColorPickerProps {
	isLoading: boolean;
	variant: string;
	colorMap: ColorMap;
	onChangeVariant: (e: React.ChangeEvent<{ value: unknown }>) => void;
	setColor: () => void;
	deleteColorOverride: () => void;
}

const useStyles = makeStyles((theme) => {
	return {
		variantSelect: {
			display: "flex",
			flexDirection: "column",
		},
		nations: {
			display: "flex",
			height: theme.spacing(6),
			alignItems: "center",
			justifyContent: "space-between",
			"& > div": {
				display: "flex",
				alignItems: "center",
			},
		},
	};
});

const NationColorPicker = ({
	isLoading,
	variant,
	colorMap,
	onChangeVariant,
	setColor,
	deleteColorOverride,
}: NationColorPickerProps): React.ReactElement => {
	const classes = useStyles();
	if (isLoading) return <></>; // TODO
	console.log(colorMap);
	return (
		<>
			<FormControl>
				<InputLabel shrink id="variantinputlabel">
					Variant
				</InputLabel>
				<Select
					fullWidth
					labelId="variantinputlabel"
					value={variant}
					onChange={onChangeVariant}
				>
					{Object.keys(colorMap).map((variantName) => (
						<MenuItem key={variantName} value={variantName}>
							{variantName}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<div className={classes.variantSelect}>
				{colorMap[variant].map(({ name, color, edited }) => {
					return (
						<div className={classes.nations} key={name}>
							<Typography>{name}</Typography>
							<div>
								<Color
									initialValue={color}
									edited={edited}
									onSelect={setColor}
								/>
								{edited && (
									<IconButton onClick={deleteColorOverride}>
										<DeleteIcon />
									</IconButton>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default NationColorPicker;
