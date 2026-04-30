import type { Meta, StoryObj } from '@storybook/react';
import TodayExpenseBox from '@/shared/ui/house-hold/TodayExpenseBox';

const meta = {
  title: 'Common/TodayExpenseBox',
  component: TodayExpenseBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodayExpenseBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
