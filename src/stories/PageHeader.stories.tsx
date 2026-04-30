import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from '@/shared/ui/PageHeader';

const meta = {
  title: 'Common/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    showBack: {
      control: 'boolean',
    },
    showClose: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBackButton: Story = {
  args: {
    title: '페이지 제목',
    showBack: true,
    showClose: false,
  },
};

export const WithCloseButton: Story = {
  args: {
    title: '페이지 제목',
    showBack: false,
    showClose: true,
  },
};

export const OnlyTitle: Story = {
  args: {
    title: '페이지 제목',
    showBack: false,
    showClose: false,
  },
};

export const LongTitle: Story = {
  args: {
    title: '이것은 매우 긴 페이지 제목입니다',
    showBack: true,
    showClose: false,
  },
};
