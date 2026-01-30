import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  MessageIcon,
  SearchIcon,
  StarIcon,
  StarOutlineIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  FollowIcon,
  LightbulbIcon,
  ZapIcon,
} from './Icons';

// Create a wrapper component for documentation
const IconShowcase = ({ size = 24 }: { size?: number }) => (
  <div className="grid grid-cols-5 gap-6">
    <MessageIcon size={size} />
    <SearchIcon size={size} />
    <StarIcon size={size} />
    <StarOutlineIcon size={size} />
    <MenuIcon size={size} />
    <CloseIcon size={size} />
    <ChevronDownIcon size={size} />
    <FollowIcon size={size} />
    <LightbulbIcon size={size} />
    <ZapIcon size={size} />
  </div>
);

const meta = {
  title: 'Atoms/Icons',
  component: IconShowcase,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof IconShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-8">
      <div className="flex flex-col items-center gap-2">
        <MessageIcon size={24} />
        <span className="text-xs text-zinc-500">Message</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SearchIcon size={24} />
        <span className="text-xs text-zinc-500">Search</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StarIcon size={24} className="text-yellow-400" />
        <span className="text-xs text-zinc-500">Star (filled)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StarOutlineIcon size={24} />
        <span className="text-xs text-zinc-500">Star (outline)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MenuIcon size={24} />
        <span className="text-xs text-zinc-500">Menu</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CloseIcon size={24} />
        <span className="text-xs text-zinc-500">Close</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ChevronDownIcon size={24} />
        <span className="text-xs text-zinc-500">Chevron</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FollowIcon size={24} />
        <span className="text-xs text-zinc-500">Follow (+)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LightbulbIcon size={24} className="text-yellow-500" />
        <span className="text-xs text-zinc-500">Lightbulb</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ZapIcon size={24} className="text-yellow-500" />
        <span className="text-xs text-zinc-500">Zap</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-1">
          <SearchIcon size={16} />
          <span className="text-xs text-zinc-500">16px</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SearchIcon size={20} />
          <span className="text-xs text-zinc-500">20px</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SearchIcon size={24} />
          <span className="text-xs text-zinc-500">24px</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SearchIcon size={32} />
          <span className="text-xs text-zinc-500">32px</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SearchIcon size={48} />
          <span className="text-xs text-zinc-500">48px</span>
        </div>
      </div>
    </div>
  ),
};

export const WithColors: Story = {
  render: () => (
    <div className="flex gap-4">
      <MessageIcon size={24} className="text-primary-500" />
      <SearchIcon size={24} className="text-blue-500" />
      <StarIcon size={24} className="text-yellow-400" />
      <CloseIcon size={24} className="text-red-500" />
      <FollowIcon size={24} className="text-green-500" />
      <ZapIcon size={24} className="text-orange-500" />
    </div>
  ),
};

export const RatingStars: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1">
        <StarIcon size={20} className="text-yellow-400" />
        <StarIcon size={20} className="text-yellow-400" />
        <StarIcon size={20} className="text-yellow-400" />
        <StarIcon size={20} className="text-yellow-400" />
        <StarOutlineIcon size={20} className="text-zinc-300" />
        <span className="ml-2 text-sm text-zinc-600">4/5</span>
      </div>
      <div className="flex gap-1">
        <StarIcon size={20} className="text-yellow-400" />
        <StarIcon size={20} className="text-yellow-400" />
        <StarOutlineIcon size={20} className="text-zinc-300" />
        <StarOutlineIcon size={20} className="text-zinc-300" />
        <StarOutlineIcon size={20} className="text-zinc-300" />
        <span className="ml-2 text-sm text-zinc-600">2/5</span>
      </div>
    </div>
  ),
};

export const NavigationIcons: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
        <MenuIcon size={24} />
      </button>
      <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
        <SearchIcon size={24} />
      </button>
      <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
        <MessageIcon size={24} />
      </button>
      <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
        <CloseIcon size={24} />
      </button>
    </div>
  ),
};
