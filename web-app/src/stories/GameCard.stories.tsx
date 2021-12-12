import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/GameCard";
import { Container } from "@mui/material";

export default {
  title: "components/GameCard",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Container style={{ width: "800px" }}>
    <Component {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {};
