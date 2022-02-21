import { StyleProp, TextStyle } from "react-native";

declare module "react-native-elements" {
	export type Palette = {
		[key: string]: {
			main: string;
			light?: string;
			dark?: string;
			contrastText?: string;
		};
	};

	export interface FullTheme {
		palette: Palette;
		spacing: (value: number) => number;
	}
}
