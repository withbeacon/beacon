import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from ".";

import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const children = "Button";
const size = "md";

export default {
  title: "Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  intent: "primary",
  filled: true,
  children,
  size,
};

Primary.play = async ({ canvasElement }) => {
  const button = within(canvasElement).getByText(children);
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent(children);
};

export const Normal = Template.bind({});

Normal.args = {
  intent: "normal",
  filled: true,
  children,
  size,
};

Normal.play = async ({ canvasElement }) => {
  const button = within(canvasElement).getByText(children);
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent(children);
};

export const Destructive = Template.bind({});

Destructive.args = {
  intent: "destructive",
  filled: true,
  children,
  size,
};

Destructive.play = async ({ canvasElement }) => {
  const button = within(canvasElement).getByText(children);
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent(children);
};

