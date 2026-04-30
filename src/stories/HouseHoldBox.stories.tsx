import type { Meta, StoryObj } from '@storybook/react';
import HouseHoldBox from '@/shared/ui/house-hold/HouseHoldBox';

const meta = {
  title: 'Common/HouseHoldBox',
  component: HouseHoldBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isAnchor: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof HouseHoldBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isAnchor: false,
    children: (
      <div>
        <h3 className="font-bold text-lg mb-2">이번 주 총 지출</h3>
        <p className="text-2xl font-bold text-blue-900">₩450,000</p>
      </div>
    ),
  },
};

export const WithContent: Story = {
  args: {
    isAnchor: false,
    children: (
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">식비</span>
          <span className="font-semibold">₩150,000</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">카페</span>
          <span className="font-semibold">₩45,000</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <span className="font-bold">총액</span>
          <span className="font-bold text-blue-900">₩195,000</span>
        </div>
      </div>
    ),
  },
};

export const AsAnchor: Story = {
  args: {
    isAnchor: true,
    anchor: '/',
    children: (
      <div className="cursor-pointer hover:opacity-80">
        <h3 className="font-bold text-lg mb-2">클릭 가능한 박스</h3>
        <p className="text-gray-600">이 박스를 클릭하면 페이지로 이동합니다</p>
      </div>
    ),
  },
};
