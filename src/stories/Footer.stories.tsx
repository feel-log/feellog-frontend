import type { Meta, StoryObj } from '@storybook/react';
import Footer from '@/shared/ui/Footer';

const meta = {
  title: 'Common/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative w-full max-w-md h-screen bg-white">
        <div className="p-4 pb-32">
          <h1 className="text-2xl font-bold mb-4">페이지 컨텐츠</h1>
          <p className="text-gray-600">푸터 컴포넌트는 화면 하단에 고정되어 있습니다.</p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
