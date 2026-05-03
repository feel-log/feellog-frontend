import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SortButton from '@/shared/ui/SortButton';

const meta = {
  title: 'Common/SortButton',
  component: SortButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    sortType: {
      control: 'select',
      options: ['latest', 'oldest', 'expensive', 'cheap'],
    },
  },
} satisfies Meta<typeof SortButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Latest: Story = {
  render: (args) => {
    const [sortType, setSortType] = useState(args.sortType || 'latest');
    return (
      <SortButton sortType={sortType} onSortChange={setSortType} />
    );
  },
  args: {
    sortType: 'latest',
  },
};

export const Expensive: Story = {
  render: (args) => {
    const [sortType, setSortType] = useState(args.sortType || 'expensive');
    return (
      <SortButton sortType={sortType} onSortChange={setSortType} />
    );
  },
  args: {
    sortType: 'expensive',
  },
};

export const Cheap: Story = {
  render: (args) => {
    const [sortType, setSortType] = useState(args.sortType || 'cheap');
    return (
      <SortButton sortType={sortType} onSortChange={setSortType} />
    );
  },
  args: {
    sortType: 'cheap',
  },
};

export const Oldest: Story = {
  render: (args) => {
    const [sortType, setSortType] = useState(args.sortType || 'oldest');
    return (
      <SortButton sortType={sortType} onSortChange={setSortType} />
    );
  },
  args: {
    sortType: 'oldest',
  },
};

export const Interactive: Story = {
  args: {
    sortType: 'latest',
  },
  render: () => {
    const [sortType, setSortType] = useState<'latest' | 'oldest' | 'expensive' | 'cheap'>('latest');
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">현재 정렬: <strong>{sortType}</strong></p>
        <SortButton sortType={sortType} onSortChange={setSortType} />
      </div>
    );
  },
};
