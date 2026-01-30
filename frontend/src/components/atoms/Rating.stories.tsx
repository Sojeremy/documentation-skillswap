import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Rating } from './Rating';

const meta = {
  title: 'Atoms/Rating',
  component: Rating,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    score: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    maxScore: { control: { type: 'number', min: 1, max: 10 } },
    size: { control: { type: 'number', min: 12, max: 32 } },
    showCount: { control: 'boolean' },
    interactive: { control: 'boolean' },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    score: 4,
  },
};

export const WithCount: Story = {
  args: {
    score: 4.5,
    showCount: true,
    count: 128,
  },
};

export const Interactive: Story = {
  args: {
    score: 3,
    interactive: true,
    onChange: (score: number) => console.log('Rating changed:', score),
  },
};

export const LargeSize: Story = {
  args: {
    score: 5,
    size: 24,
  },
};

export const Empty: Story = {
  args: {
    score: 0,
  },
};

export const FullStars: Story = {
  args: {
    score: 5,
  },
};

export const AllScores: Story = {
  args: { score: 0 },
  render: () => (
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3, 4, 5].map((score) => (
        <div key={score} className="flex items-center gap-4">
          <span className="w-8 text-sm text-zinc-500">{score}/5</span>
          <Rating score={score} />
        </div>
      ))}
    </div>
  ),
};

export const InteractiveDemo: Story = {
  args: { score: 3 },
  render: function InteractiveRating() {
    const [score, setScore] = useState(3);
    return (
      <div className="flex flex-col items-center gap-4">
        <Rating score={score} interactive onChange={setScore} size={24} />
        <p className="text-sm text-zinc-600">Note sélectionnée : {score}/5</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  args: { score: 4 },
  render: () => (
    <div className="flex flex-col gap-4">
      <Rating score={4} size={12} />
      <Rating score={4} size={16} />
      <Rating score={4} size={20} />
      <Rating score={4} size={24} />
      <Rating score={4} size={32} />
    </div>
  ),
};
