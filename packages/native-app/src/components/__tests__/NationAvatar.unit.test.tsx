import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import NationAvatar from "../NationAvatar";
import { View } from "react-native";
import { brightnessByColor } from "../../../common";

interface ArrangeOptions {
  props: Parameters<typeof NationAvatar>[0];
}

let props: Parameters<typeof NationAvatar>[0];

jest.mock("../../../common", () => ({
  ...jest.requireActual("../../../common"),
  brightnessByColor: jest.fn(() => 0),
}));

const mockBrightnessByColor = brightnessByColor as jest.Mock;

describe("NationAvatar", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(
      <View testID="avatar-wrapper">
        <NationAvatar {...options.props} />
      </View>
    );
  };
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({
          ok: true,
          status: 200,
          text: () => "<svg></svg>",
        });
      });
    });
    props = {
      color: "#FFF",
      link: "www.fake.com",
      nation: "England",
      nationAbbreviation: "eng",
      onPress: () => {},
    };
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Renders with dark color", () => {
    mockBrightnessByColor.mockImplementationOnce(() => 200);
    props.color = "#000";
    arrange({ props });
  });
});
