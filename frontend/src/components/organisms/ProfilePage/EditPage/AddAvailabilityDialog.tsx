// ============================================================================
// ADD AVAILABILITY DIALOG COMPONENT
// ============================================================================

'use client';

import { useState, useEffect, FormEvent } from 'react';
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
import {
  AddUserAvailabilitySchema,
  type AddUserAvailabilityData,
} from '@/lib/validation/updateProfile.validation';
import { validate } from '@/lib/utils';
import { toast } from 'sonner';

interface AddAvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddUserAvailabilityData) => Promise<void>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

type Day =
  | 'Lundi'
  | 'Mardi'
  | 'Mercredi'
  | 'Jeudi'
  | 'Vendredi'
  | 'Samedi'
  | 'Dimanche';

const DAYS: readonly Day[] = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
] as const;

const TIME_SLOTS_FR_TO_EN = {
  Matin: 'Morning',
  'Après-midi': 'Afternoon',
} as const;

type TimeSlotFr = keyof typeof TIME_SLOTS_FR_TO_EN;

const TIME_SLOTS: readonly TimeSlotFr[] = ['Matin', 'Après-midi'] as const;

// ============================================================================
// COMPOSANT
// ============================================================================

export function AddAvailabilityDialog({
  isOpen,
  onClose,
  onSubmit,
}: AddAvailabilityDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDay, setSelectedDay] = useState<Day | ''>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotFr | ''>('');

  useEffect(() => {
    if (isOpen) {
      // Reset form
      setSelectedDay('');
      setSelectedTimeSlot('');
    }
  }, [isOpen]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!selectedDay || !selectedTimeSlot) {
      toast.error('Veuillez selectionner une disponnibilité');
      return;
    }

    const formData: AddUserAvailabilityData = {
      day: selectedDay,
      timeSlot: TIME_SLOTS_FR_TO_EN[selectedTimeSlot],
    };

    if (!validate(AddUserAvailabilitySchema, formData)) {
      toast.error('Disponnibilité invalide');
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateDay(value: Day) {
    setSelectedDay(value);
  }

  function updateTimeSlot(value: TimeSlotFr) {
    setSelectedTimeSlot(value);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-106.25"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Ajouter une disponibilité</DialogTitle>
          <DialogDescription id="dialog-description">
            Sélectionnez un jour et un créneau horaire pour indiquer votre
            disponibilité.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label="Ajouter une disponibilité"
        >
          {/* Day Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Jour
              <span className="sr-only"> (requis)</span>
            </label>
            <Select
              onValueChange={(value) => updateDay(value as Day)}
              value={selectedDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un jour" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Créneau horaire
              <span className="sr-only"> (requis)</span>
            </label>
            <Select
              onValueChange={(value) => updateTimeSlot(value as TimeSlotFr)}
              value={selectedTimeSlot}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un créneau" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedDay || !selectedTimeSlot}
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
