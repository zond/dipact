import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import { ThemeProvider } from "@rneui/themed";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import Switch from "../Switch";
import { theme } from "../../theme";

const WrappedSwitch = (props: Parameters<typeof Switch>[0]) => {
	return (
		<ThemeProvider theme={theme}>
			<Switch {...props} />
		</ThemeProvider>
	);
};

describe("Snapshot tests", () => {
	let onValueChange = () => {};
	test("False without label", () => {
		const props = { value: false, onValueChange };
		const tree = renderer.create(<WrappedSwitch {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	test("False with label", () => {
		const props = { value: false, label: "Click here", onValueChange };
		const tree = renderer.create(<WrappedSwitch {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	test("True without label", () => {
		const props = { value: true, onValueChange };
		const tree = renderer.create(<WrappedSwitch {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	test("True with label", () => {
		const props = { value: true, label: "Click here", onValueChange };
		const tree = renderer.create(<WrappedSwitch {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe("Functional tests", () => {
	let props: Parameters<typeof Switch>[0];
	beforeEach(() => {
		props = { value: false, onValueChange: jest.fn() };
	})
	test("Click when false", () => {
		const { getByTestId } = render(<WrappedSwitch {...props} />);
		const _switch = getByTestId("switch");
		fireEvent(_switch, "valueChange", true);
		expect(props.onValueChange).toBeCalledWith(true);
	});
	test("Click when true", () => {
		const { getByTestId } = render(<WrappedSwitch {...props} />);
		const _switch = getByTestId("switch");
		fireEvent(_switch, "valueChange", false);
		expect(props.onValueChange).toBeCalledWith(false);
	});
	test("Shows label", () => {
		props.label = "Switch label";
		const { getByText } = render(<WrappedSwitch {...props} />);
		getByText(props.label);
	});
});
