import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Titre de la carte</CardTitle>
        <CardDescription>Description de la carte</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenu de la carte avec du texte.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Confirmation</CardTitle>
        <CardDescription>Voulez-vous continuer ?</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600">
          Cette action ne peut pas être annulée.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Annuler</Button>
        <Button>Confirmer</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProfileCard: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
            SM
          </div>
          <div>
            <CardTitle>Sophie Martin</CardTitle>
            <CardDescription>Développeuse React</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-1 bg-zinc-100 rounded text-xs">React</span>
          <span className="px-2 py-1 bg-zinc-100 rounded text-xs">
            TypeScript
          </span>
          <span className="px-2 py-1 bg-zinc-100 rounded text-xs">Next.js</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Voir le profil</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-64 p-4">
      <p className="text-sm">Carte simple avec padding</p>
    </Card>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {['Design', 'Code', 'Marketing', 'Photo'].map((skill) => (
        <Card
          key={skill}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <p className="font-medium">{skill}</p>
          <p className="text-sm text-zinc-500">12 membres</p>
        </Card>
      ))}
    </div>
  ),
};
