import type { Meta, StoryObj } from '@storybook/react';
import { ClientOnly } from '@/shared/ui/ClientOnly';

const meta = {
  title: 'Common/ClientOnly',
  component: ClientOnly,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ClientOnly>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">이것은 클라이언트에서만 렌더링됩니다.</p>
        <p className="text-sm text-gray-500 mt-2">현재 시간: {new Date().toLocaleTimeString()}</p>
      </div>
    ),
  },
};

export const WithFallback: Story = {
  args: {
    fallback: (
      <div className="p-4 bg-gray-100 rounded-lg animate-pulse">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    ),
    children: (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">콘텐츠가 로드되었습니다.</p>
        <p className="text-sm text-gray-500 mt-2">현재 시간: {new Date().toLocaleTimeString()}</p>
      </div>
    ),
  },
};
