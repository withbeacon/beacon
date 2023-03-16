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
  variant: "primary",
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
  variant: "normal",
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
  variant: "destructive",
  children,
  size,
};

Destructive.play = async ({ canvasElement }) => {
  const button = within(canvasElement).getByText(children);
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent(children);
};

