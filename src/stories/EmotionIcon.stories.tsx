import type { Meta, StoryObj } from '@storybook/react';
import EmotionIcon from '@/shared/ui/EmotionIcon';

const meta = {
  title: 'Common/EmotionIcon',
  component: EmotionIcon,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
    },
    size: {
      control: 'number',
    },
  },
} satisfies Meta<typeof EmotionIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const emotions = [
  '기쁨', '설렘', '뿌듯함', '고마움',
  '짜증', '화남', '불안함', '슬픔', '스트레스', '우울함',
  '심심함', '피곤함', '공허함', '외로움', '충동'
];

export const AllEmotions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {emotions.map((emotion) => (
        <div key={emotion} className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg">
          <EmotionIcon name={emotion} size={32} />
          <span className="text-xs text-gray-600">{emotion}</span>
        </div>
      ))}
    </div>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {emotions.slice(0, 5).map((emotion) => (
        <div key={emotion} className="flex flex-col items-center gap-2">
          <EmotionIcon name={emotion} size={20} />
          <span className="text-xs text-gray-600">{emotion}</span>
        </div>
      ))}
    </div>
  ),
};

export const LargeSize: Story = {
  render: () => (
    <div className="flex gap-8 flex-wrap">
      {emotions.slice(0, 3).map((emotion) => (
        <div key={emotion} className="flex flex-col items-center gap-2">
          <EmotionIcon name={emotion} size={48} />
          <span className="text-sm text-gray-600">{emotion}</span>
        </div>
      ))}
    </div>
  ),
};

export const Single: Story = {
  args: {
    name: '기쁨',
    size: 32,
  },
};
