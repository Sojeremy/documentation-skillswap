'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log('Page:', page),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page) => console.log('Page:', page),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page) => console.log('Page:', page),
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    onPageChange: (page) => console.log('Page:', page),
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    onPageChange: (page) => console.log('Page:', page),
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: (page) => console.log('Page:', page),
  },
};

export const Interactive: Story = {
  args: { currentPage: 1, totalPages: 10, onPageChange: () => {} },
  render: function InteractiveDemo() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    return (
      <div className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Page {currentPage} sur {totalPages}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};

export const WithContent: Story = {
  args: { currentPage: 1, totalPages: 10, onPageChange: () => {} },
  render: function WithContentDemo() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalItems = 47;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="space-y-4 w-full max-w-md">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Affichage {startItem}-{endItem} sur {totalItems} résultats
          </p>
          <div className="space-y-2">
            {Array.from({
              length: Math.min(
                itemsPerPage,
                totalItems - (currentPage - 1) * itemsPerPage,
              ),
            }).map((_, i) => (
              <div key={i} className="p-2 bg-muted/30 rounded text-sm">
                Élément {startItem + i}
              </div>
            ))}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};
