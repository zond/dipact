import { Meta, Story } from "@storybook/react";
import React, { ComponentProps } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { createStore } from "redux";
import rootReducer from "../../store/reducer";

const store = createStore(rootReducer);

import Component from "./Menu";

export default {
  title: "Components/Menu",
  component: Component,
  decorators: [
    (story) => (
      <Provider store={store}>
        <MemoryRouter>{story()}</MemoryRouter>
      </Provider>
    ),
  ],
} as Meta;

const Template: Story<ComponentProps<typeof Component>> = (args) => (
  <Component {...args} />
);

export const Default: Story = Template.bind({});
