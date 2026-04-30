import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import BottomSheet from '@/shared/ui/BottomSheet';

const meta = {
  title: 'Common/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    isSaveDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: '카테고리 선택',
    onClose: () => {},
    onSave: () => alert('Saved!'),
    isSaveDisabled: false,
    children: (
      <div className="space-y-4">
        <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
          식비
        </button>
        <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
          카페
        </button>
        <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
          생필품
        </button>
        <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
          교통
        </button>
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    isOpen: true,
    title: '카테고리 선택',
    onClose: () => {},
    onSave: () => alert('Saved!'),
    isSaveDisabled: true,
    children: (
      <div className="space-y-4">
        <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
          식비
        </button>
        <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
          카페
        </button>
      </div>
    ),
  },
};

export const NoSaveButton: Story = {
  args: {
    isOpen: true,
    title: '알림',
    onClose: () => {},
    children: (
      <div>
        <p className="text-gray-700">이것은 저장 버튼이 없는 바텀 시트입니다.</p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className="p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-2 bg-blue-900 text-white rounded-lg"
        >
          바텀 시트 열기
        </button>

        <BottomSheet
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={() => {
            alert(`저장됨: ${selected}`);
            setIsOpen(false);
          }}
          isSaveDisabled={!selected}
        >
          <div className="space-y-4">
            {['식비', '카페', '생필품', '교통'].map((item) => (
              <button
                key={item}
                onClick={() => setSelected(item)}
                className={`w-full px-4 py-3 text-left border rounded-lg ${
                  selected === item
                    ? 'border-blue-900 bg-blue-50 font-semibold text-blue-900'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>
    );
  },
  args: {
    title: '카테고리 선택',
  },
};
