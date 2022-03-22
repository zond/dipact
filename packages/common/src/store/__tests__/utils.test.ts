import { Variant, VariantResponse } from "../types";
import { addNationAbbreviationsToVariant, sortVariantResponse } from "../utils";

export {};

const defaultVariant: Variant = {
	Name: "",
	Nations: [""],
	PhaseTypes: [""],
	Season: [""],
	UnitTypes: [""],
	SvgVersion: "",
	ProvinceLongNames: {},
	nationAbbreviations: {},
	NationColors: null,
	CreatedBy: "",
	Version: "",
	Description: "",
	Rules: "",
	OrderTypes: [""],
	Graph: { Nodes: {} },
	Links: null,
	ExtraDominanceRules: {},
};

const defaultVariantResponse: VariantResponse = {
	Name: "",
	Type: "",
	Links: null,
	Properties: { ...defaultVariant },
};

describe("sortVariantResponse", () => {
	it("sort variants correctly", () => {
		const first = { ...defaultVariantResponse, Name: "Classical" };
		const second = { ...defaultVariantResponse, Name: "AAA" };
		const third = { ...defaultVariantResponse, Name: "BBB" };
		const variants = [third, first, second];
		const sortedVariants = sortVariantResponse(variants);

		expect(sortedVariants[0]).toBe(first);
		expect(sortedVariants[1]).toBe(second);
		expect(sortedVariants[2]).toBe(third);
	});
});
describe("addNationAbbreviationsToVariants", () => {
	it("adds classical nation abbreviations correctly", () => {
		const Nations = ["Austria", "England", "France"];
		const variant: Variant = { ...defaultVariant, Nations };
		const enhancedVariant = addNationAbbreviationsToVariant(variant);
		expect(enhancedVariant.nationAbbreviations["Austria"]).toBe("A");
		expect(enhancedVariant.nationAbbreviations["England"]).toBe("E");
		expect(enhancedVariant.nationAbbreviations["France"]).toBe("F");
	});
	it("adds complicated nation abbreviations correctly", () => {
		const Nations = [
			"Kingdom of Denmark",
			"Khaganate of Khazaria",
			"East Frankish Kingdom",
			"Eastern Roman Empire",
		];
		const variant: Variant = { ...defaultVariant, Nations };
		const enhancedVariant = addNationAbbreviationsToVariant(variant);
		expect(enhancedVariant.nationAbbreviations["Kingdom of Denmark"]).toBe("Ki");
		expect(enhancedVariant.nationAbbreviations["Khaganate of Khazaria"]).toBe("Kh");
		expect(enhancedVariant.nationAbbreviations["East Frankish Kingdom"]).toBe("East ");
		expect(enhancedVariant.nationAbbreviations["Eastern Roman Empire"]).toBe("Easte");
	});
});
