import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component, { OrderDisplay } from "../components/Orders/Order";

export default {
  title: "components/Orders/Order",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "500px" }}>
    <Component {...args} />
  </div>
);

type Args = React.ComponentProps<typeof Component>;

const defaultOrder: OrderDisplay = {
  label: "Trieste move to Adriatic Sea",
  inconsistencies: [],
  resolution: null,
};

const defaultArgs: Args = {
  order: { ...defaultOrder },
};

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

export const Inconsistency = Template.bind({});
Inconsistency.args = {
  ...defaultArgs,
  order: {
    ...defaultOrder,
    inconsistencies: ["Doesn't match order for Burgundy"],
  },
};

export const MultipleInconsistencies = Template.bind({});
MultipleInconsistencies.args = {
  ...defaultArgs,
  order: {
    ...defaultOrder,
    inconsistencies: ["Doesn't match order for Burgundy", "No matching convoy"],
  },
};

export const ResolvedSuccess = Template.bind({});
ResolvedSuccess.args = {
  ...defaultArgs,
  order: {
    ...defaultOrder,
    resolution: "Success",
  },
};

export const ResolvedBounce = Template.bind({});
ResolvedBounce.args = {
  ...defaultArgs,
  order: {
    ...defaultOrder,
    resolution: "Bounced",
  },
};
