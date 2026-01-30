'use client';

import { Avatar } from '@/components/atoms/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/DropdownMenu';
import type { ConversationWithMessages } from '@/lib/api-types';
import { getInitialsFromName } from '@/lib/utils';
import {
  ArrowLeft,
  CheckCircle,
  MoreVertical,
  Star,
  Trash2,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface ThreadHeaderProps {
  selectedConv: ConversationWithMessages;
  showBackButton?: boolean;
  onBack?: () => void;
  onViewProfile: () => void;
  onRatingOpen: () => void;
  onEncloseOpen: () => void;
  onDeleteOpen: () => void;
}

/**
 * Header du thread de messages avec avatar, nom et menu d'actions
 */
export function ThreadHeader({
  selectedConv,
  showBackButton,
  onBack,
  onViewProfile,
  onRatingOpen,
  onEncloseOpen,
  onDeleteOpen,
}: ThreadHeaderProps) {
  const initials = selectedConv.participant
    ? getInitialsFromName(selectedConv.participant.firstname)
    : '?';

  return (
    <div className="flex w-full items-center border-b bg-background px-2 md:px-6 py-4 h-20 gap-3">
      {showBackButton && (
        <button
          onClick={onBack}
          className="rounded p-2 hover:bg-muted shrink-0"
          aria-label="Retour à la liste"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <Link href={`/profil/${selectedConv.participant?.id}`}>
        <Avatar
          user={selectedConv.participant}
          initials={!selectedConv.participant ? initials : undefined}
          size="md"
          className="shrink-0"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-muted-foreground">
          <Link
            href={`/profil/${selectedConv.participant?.id}`}
            className="hover:underline"
          >
            {selectedConv.participant
              ? `${selectedConv.participant.firstname} ${selectedConv.participant.lastname}`
              : 'Utilisateur inconnu'}
          </Link>
        </p>
        <p
          title={selectedConv.title}
          className="truncate text-xs text-muted-foreground"
        >
          {selectedConv.title}
        </p>
      </div>

      <div className="shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded p-2 hover:bg-muted"
              aria-label="Actions de la conversation"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="**:[[role=menuitem]]:cursor-pointer"
          >
            {selectedConv.participant && (
              <DropdownMenuItem
                onClick={onViewProfile}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Voir le profil</span>
              </DropdownMenuItem>
            )}
            {selectedConv.participant?.isRated === false && (
              <DropdownMenuItem
                onClick={onRatingOpen}
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                <span>Evaluer l&apos;utilisateur</span>
              </DropdownMenuItem>
            )}
            {selectedConv.status === 'Open' ? (
              <DropdownMenuItem
                onClick={onEncloseOpen}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Clôturer l&apos;échange</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={onDeleteOpen}
                className="flex items-center gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 text-destructive focus:text-destructive" />
                <span>Supprimer la conversation</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
