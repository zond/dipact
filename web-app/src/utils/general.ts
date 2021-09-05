import Globals from "../Globals";
import { ColorOverrides, Phase, Variant } from "../store/types";

const DiplicitySender = "Diplicity";
const OttoURL = "https://diplicity-engine.appspot.com/img/otto.png";

export const getPhaseName = ({ Season, Year, Type }: Phase): string => `${Season} ${Year}, ${Type}`

export const getNationColor = (variant: Variant, nation: string): string => {
	const colorOverrides = Globals.colorOverrides as ColorOverrides;
	const variantColorOverrides = colorOverrides.variants[variant.Name];
	if (variantColorOverrides) {
		const nationColorOverride = variantColorOverrides[nation];
		if (nationColorOverride) return nationColorOverride
	}
	const nationColors = variant?.NationColors;
	const nationColor = nationColors ? nationColors[nation]: null;
	if (nationColor) return nationColor
	const nationNotInVariant = !variant?.Nations?.includes(nation);
	if (nationNotInVariant) {
		if (nation === "Neutral") {
			return "#d0d0d0";
		}
		if (nation === "Diplicity") {
			return "#000000";
		}
		throw Error(`Cannot find nation color for ${nation} in variant ${variant.Name}`);
	}
	const index = variant?.Nations.indexOf(nation);
	if (typeof index !== "undefined") return Globals.contrastColors[index];
	throw Error(`Cannot find nation color for ${nation} in variant ${variant.Name}`);
}

export const getNationAbbreviation = (variant: Variant, nation: string): string => {
	const nationAbbreviations = variant?.nationAbbreviations;
	if (!nationAbbreviations) return "";
	return nationAbbreviations[nation] || "";
}

export const getNationFlagLink = (variant: Variant, nation: string): string | undefined => {
	const links = variant?.Links;
	const linkObject = links ? links.find((link) => link.Rel === `flag-${nation}`) : null;
    return nation === DiplicitySender ? OttoURL : linkObject ? linkObject.URL : undefined;
};