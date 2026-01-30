'use client';

import { useState, useEffect, useCallback, FormEvent, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/components/atoms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import {
  AddUserSkillSchema,
  type AddUserSkillData,
} from '@/lib/validation/updateProfile.validation';
import { Skill } from '@/lib/api-types';
import { toast } from 'sonner';
import { validate } from '@/lib/utils';

interface AddSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddUserSkillData) => Promise<void>;
  mode: 'skill' | 'interest';
}

interface Category {
  id: number;
  name: string;
}

const LABELS = {
  skill: {
    title: 'Ajouter une compétence',
    description: 'Sélectionnez une compétence que vous maîtrisez.',
    fieldLabel: 'Compétence',
    categoryLabel: 'Catégorie',
    categoryPlaceholder: 'Toutes les catégories',
    placeholder: 'Sélectionnez une compétence',
    emptyMessage: 'Aucune compétence disponible',
    errorMessage: 'Impossible de charger les compétences',
    loadingMessage: 'Chargement des compétences en cours',
  },
  interest: {
    title: 'Ajouter un intérêt',
    description:
      'Sélectionnez un domaine qui vous intéresse et que vous souhaitez découvrir.',
    fieldLabel: 'Intérêt',
    categoryLabel: 'Catégorie',
    categoryPlaceholder: 'Toutes les catégories',
    placeholder: 'Sélectionnez un intérêt',
    emptyMessage: 'Aucun intérêt disponible',
    errorMessage: 'Impossible de charger les intérêts',
    loadingMessage: 'Chargement des intérêts en cours',
  },
} as const;

export function AddSkillDialog({
  isOpen,
  onClose,
  onSubmit,
  mode,
}: AddSkillDialogProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>(
    'all',
  );

  const [formData, setFormData] = useState<AddUserSkillData>({
    skillId: NaN,
  });

  const labels = LABELS[mode];

  const categories = useMemo<Category[]>(() => {
    const map = new Map<number, Category>();

    skills.forEach((skill) => {
      const category = skill.category;
      if (!map.has(category.id)) {
        map.set(category.id, {
          id: category.id,
          name: category.name,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategoryId === 'all') return skills;

    return skills.filter((skill) => skill.category.id === selectedCategoryId);
  }, [skills, selectedCategoryId]);

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoadingSkills(true);
      const response = await api.getSkills();

      if (response.data) {
        setSkills(response.data);
      }
    } catch {
      toast.error(labels.errorMessage);
    } finally {
      setIsLoadingSkills(false);
    }
  }, [labels.errorMessage]);

  useEffect(() => {
    if (isOpen) {
      fetchSkills();
      setFormData({ skillId: NaN });
      setSelectedCategoryId('all');
    }
  }, [isOpen, fetchSkills]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate(AddUserSkillSchema, formData)) {
      toast.error(`${labels.fieldLabel} invalide`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(value: number) {
    setFormData({ skillId: value });
  }

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value === 'all' ? 'all' : Number(value));
    setFormData({ skillId: NaN });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Filter */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              {labels.categoryLabel}
            </label>
            <Select
              onValueChange={handleCategoryChange}
              value={selectedCategoryId.toString()}
              disabled={isLoadingSkills}
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.categoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {labels.categoryPlaceholder}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">{labels.fieldLabel}</label>
            <Select
              onValueChange={(value) => updateField(Number(value))}
              value={isNaN(formData.skillId) ? '' : formData.skillId.toString()}
              disabled={isLoadingSkills}
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSkills ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : filteredSkills.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {selectedCategoryId === 'all'
                      ? labels.emptyMessage
                      : 'Aucune compétence dans cette catégorie'}
                  </div>
                ) : (
                  filteredSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id.toString()}>
                      {skill.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isNaN(formData.skillId)}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
