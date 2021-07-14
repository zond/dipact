import React, { useRef } from "react";
import iro from "@jaames/iro";
import { useEffect } from "react";
import useRegisterPageView from "../hooks/useRegisterPageview";

type IroColorPicker = {
	onColorChange: (color: string) => void;
	[key: string]: any;
};

const IroColorPicker = ({
	onColorChange,
	...colorPickerProps
}: IroColorPicker): React.ReactElement => {
	useRegisterPageView("Color");
	const divEl = useRef(null);
	useEffect(() => {
		const colorPicker = new (iro.ColorPicker as any)(
			divEl.current,
			colorPickerProps
		);
		colorPicker.on("color:change", (color: iro.Color) =>
			onColorChange(color.hexString)
		);
	}, []);

	return <div ref={divEl} />;
};

export default IroColorPicker;
