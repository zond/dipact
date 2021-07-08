import React, { useRef, useState } from "react";
import iro from "@jaames/iro";
import { useEffect } from "react";

type IroColorPicker = {
	onColorChange: (color: string) => void;
	[key: string]: any;
};

const IroColorPicker = ({
	onColorChange,
	...colorPickerProps
}: IroColorPicker): React.ReactElement => {
	const [colorPicker, setColorPicker] = useState<null | iro.ColorPicker>(null);
	const divEl = useRef(null);

	useEffect(() => {
		if (divEl.current) {
			setColorPicker((iro.ColorPicker as any)(divEl.current, colorPickerProps));
			colorPicker?.on("color:change", (color: string) => {
				onColorChange(color);
			});
		}
	}, []);

	useEffect(() => {
		const { color } = colorPickerProps;
		if (colorPicker) {
			if (color) colorPicker.color.set(color);
			colorPicker.setState(colorPickerProps);
		}
	});

	return <div ref={divEl} />;
};

export default IroColorPicker;
