import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { act } from "react-test-renderer";

import Login from "../Login";

const mockOpenUrl = jest.fn();
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: mockOpenUrl,
}));

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSigninButton: jest.fn(() => <div />),
}));

describe("Login", () => {
  const arrange = () => {
    (GoogleSigninButton as unknown as jest.Mock).mockImplementation(
      ({ onPress }) => {
        return <Button title="Sign in with Google" onPress={onPress} />;
      }
    );
    return render(<Login />);
  };
  test("Renders without error", () => {
    const { getByText } = arrange();
    getByText("Sign in with Google");
  });
  test("Clicking login button calls openUrl", () => {
    const { getByText } = arrange();
    const button = getByText("Sign in with Google");
    act(() => {
      fireEvent.press(button);
    });
    expect(mockOpenUrl).toBeCalledWith(
      "https://diplicity-engine.appspot.com/Auth/Login?redirect-to=diplicity-native://auth&token-duration=86400"
    );
  });
});
