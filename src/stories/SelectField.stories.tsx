import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SelectField from '@/shared/ui/SelectField';

const meta = {
  title: 'Common/SelectField',
  component: SelectField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    label: '카테고리 선택',
    value: '',
    placeholder: '선택해주세요',
    onClick: () => alert('Open bottom sheet'),
  },
};

export const Selected: Story = {
  args: {
    label: '카테고리 선택',
    value: '식비',
    placeholder: '선택해주세요',
    onClick: () => alert('Open bottom sheet'),
  },
};

export const WithValue: Story = {
  args: {
    label: '결제 수단',
    value: '카드',
    placeholder: '선택해주세요',
    onClick: () => alert('Open bottom sheet'),
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <SelectField
        {...args}
        value={value}
        onClick={() => {
          const options = ['식비', '카페', '생필품', '교통'];
          const newValue = options[Math.floor(Math.random() * options.length)];
          setValue(newValue);
        }}
      />
    );
  },
  args: {
    label: '카테고리 선택',
    placeholder: '선택해주세요',
  },
};
