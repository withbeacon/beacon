import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Logo } from ".";

import { expect } from "@storybook/jest";

export default {
  title: "Logo",
  component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;
export const Default = Template.bind({});

Default.play = async ({ canvasElement }) => {
  const logo = canvasElement.querySelector("img");
  expect(logo).toBeInTheDocument();
}

