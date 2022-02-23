import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/FeedbackWrapper";
import { feedbackWrapperDecorator } from "../hooks/useFeedbackWrapper";
import { Severity } from "@diplicity/common";

export default {
  title: "components/FeedbackWrapper",
  component: Component,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Component>
    <div></div>
  </Component>
);

const defaultUseFeedbackWrapperValues = {
  handleClose: () => {
    return;
  },
  feedback: [],
};

export const NoFeedback = Template.bind({});
NoFeedback.decorators = [
  feedbackWrapperDecorator({ ...defaultUseFeedbackWrapperValues }),
];

export const FeedbackSuccess = Template.bind({});
FeedbackSuccess.decorators = [
  feedbackWrapperDecorator({
    ...defaultUseFeedbackWrapperValues,
    feedback: [{ severity: Severity.Success, message: "Success!", id: 1 }],
  }),
];

export const FeedbackInfo = Template.bind({});
FeedbackInfo.decorators = [
  feedbackWrapperDecorator({
    ...defaultUseFeedbackWrapperValues,
    feedback: [{ severity: Severity.Info, message: "Info!", id: 1 }],
  }),
];

export const FeedbackWarning = Template.bind({});
FeedbackWarning.decorators = [
  feedbackWrapperDecorator({
    ...defaultUseFeedbackWrapperValues,
    feedback: [{ severity: Severity.Warning, message: "Warning!", id: 1 }],
  }),
];

export const FeedbackError = Template.bind({});
FeedbackError.decorators = [
  feedbackWrapperDecorator({
    ...defaultUseFeedbackWrapperValues,
    feedback: [{ severity: Severity.Error, message: "Error!", id: 1 }],
  }),
];
