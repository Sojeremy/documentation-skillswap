'use client';

import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/atoms/Avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/atoms/DropdownMenu';

import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import type { CurrentUser } from '@/lib/api-types';

type UserDropdownProps = {
  user: CurrentUser;
  onLogout: () => void;
  onOpenSettings?: () => void;
};

export function UserDropdown({
  user,
  onLogout,
  onOpenSettings,
}: UserDropdownProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Menu utilisateur"
          className="rounded-full translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 inline-flex items-center justify-center"
        >
          <Avatar user={user} size="sm" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 **:[[role=menuitem]]:cursor-pointer"
      >
        {/* Profil */}
        <DropdownMenuItem onClick={() => router.push(`/profil/${user.id}`)}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>

        {/* --- Settings --- */}
        <DropdownMenuItem onClick={onOpenSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-500 focus:text-red-600 focus:bg-red-50/50"
        >
          <LogOut className="mr-2 h-4 w-4 text-red-500" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
