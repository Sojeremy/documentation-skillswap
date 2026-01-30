'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Organisms/SearchBar',
  component: SearchBar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Changed:', value),
    onSubmit: () => console.log('Submitted'),
  },
};

export const WithQuery: Story = {
  args: {
    value: 'React',
    onChange: (value) => console.log('Changed:', value),
    onSubmit: () => console.log('Submitted'),
  },
};

export const ShortQuery: Story = {
  args: {
    value: 'Re',
    onChange: (value) => console.log('Changed:', value),
    onSubmit: () => console.log('Submitted'),
    minChars: 3,
  },
};

export const Loading: Story = {
  args: {
    value: 'TypeScript',
    onChange: (value) => console.log('Changed:', value),
    onSubmit: () => console.log('Submitted'),
    isLoading: true,
  },
};

export const CustomMinChars: Story = {
  args: {
    value: 'Py',
    onChange: (value) => console.log('Changed:', value),
    onSubmit: () => console.log('Submitted'),
    minChars: 5,
  },
};

export const Interactive: Story = {
  args: { value: '', onChange: () => {}, onSubmit: () => {} },
  render: function InteractiveDemo() {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const handleSubmit = () => {
      if (value.length < 3) return;
      setIsLoading(true);
      setResults([]);

      setTimeout(() => {
        setIsLoading(false);
        setResults([
          `${value} - Développeur`,
          `${value} - Designer`,
          `${value} - Formateur`,
        ]);
      }, 1000);
    };

    return (
      <div className="space-y-4">
        <SearchBar
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        {results.length > 0 && (
          <div className="p-4 border rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">Résultats :</p>
            {results.map((result, i) => (
              <div key={i} className="p-2 bg-muted/30 rounded text-sm">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

export const InSearchPage: Story = {
  args: { value: '', onChange: () => {}, onSubmit: () => {} },
  render: function SearchPageDemo() {
    const [value, setValue] = useState('');

    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Rechercher des compétences</h1>
          <p className="text-muted-foreground">
            Trouvez des membres avec les compétences qui vous intéressent
          </p>
        </div>
        <SearchBar
          value={value}
          onChange={setValue}
          onSubmit={() => console.log('Search:', value)}
        />
      </div>
    );
  },
};
