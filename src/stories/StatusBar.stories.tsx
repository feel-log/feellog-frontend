import type { Meta, StoryObj } from '@storybook/react';
import StatusBar from '@/shared/ui/StatusBar';

const meta = {
  title: 'Common/StatusBar',
  component: StatusBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
