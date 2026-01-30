'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Pencil } from 'lucide-react';
import { cn, validate } from '@/lib/utils';
import { Separator } from '@/components/atoms';
import {
  UpdatePrivateData,
  UpdatePrivateSchema,
} from '@/lib/validation/updateProfile.validation';

// ============================================================================
// Personnal Info Section
// ============================================================================
//
// Display privates informations of the current user
// In edit mode -> switch to form
//
// ============================================================================

interface PersonnalInfo {
  lastname: string;
  firstname: string;
  email: string;
  address?: string | null;
  postalCode?: number | null;
  city?: string | null;
  age?: number | null;
}

interface PersonalInfoSectionProps {
  info: PersonnalInfo;
  onUpdate?: (data: UpdatePrivateData) => void;
  className?: string;
}

export function PersonalInfoSection({
  info,
  onUpdate,
  className,
}: PersonalInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonnalInfo>(info);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdatePrivateData, string>>
  >({});

  const handleEdit = () => {
    setFormData(info);
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(info);
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = () => {
    const normalizedData = {
      ...formData,
      address: formData.address || undefined,
      city: formData.city || undefined,
      postalCode: formData.postalCode ?? undefined,
      age: formData.age ?? undefined,
    };

    const isValid = validate(UpdatePrivateSchema, normalizedData, setErrors);

    if (!isValid) return;

    onUpdate?.(normalizedData);
    setIsEditing(false);
  };

  const updateField = <K extends keyof PersonnalInfo>(
    field: K,
    value: PersonnalInfo[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3>Informations personnelles</h3>
        {!isEditing && onUpdate && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil size={16} />
            Modifier
          </Button>
        )}
      </div>

      <Card className={cn(className)}>
        <CardContent className="p-6">
          {isEditing ? (
            // Mode édition : Formulaire
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Input
                    id="firstname"
                    label="Prénom *"
                    value={formData.firstname}
                    onChange={(e) => updateField('firstname', e.target.value)}
                    error={errors.firstname}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="lastname"
                    label="Nom *"
                    value={formData.lastname}
                    onChange={(e) => updateField('lastname', e.target.value)}
                    error={errors.lastname}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="email"
                    label="Email *"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={errors.email}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="address"
                    label="Adresse"
                    value={formData.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                    error={errors.address}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="postalCode"
                    label="Code postal"
                    value={formData.postalCode || ''}
                    onChange={(e) =>
                      updateField('postalCode', parseInt(e.target.value))
                    }
                    error={errors.postalCode}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="city"
                    label="Ville"
                    value={formData.city || ''}
                    onChange={(e) => updateField('city', e.target.value)}
                    error={errors.city}
                  />
                </div>

                <div className="grid gap-2">
                  <Input
                    id="age"
                    label="Âge"
                    type="number"
                    value={formData.age?.toString() || ''}
                    onChange={(e) =>
                      updateField('age', parseInt(e.target.value))
                    }
                    error={errors.age}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                  Enregistrer
                </Button>
              </div>
            </div>
          ) : (
            // Read mode: display informations
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Prénom" value={info.firstname} />
                <InfoItem label="Nom" value={info.lastname} />
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Email" value={info.email} />
                <InfoItem label="Adresse" value={info.address} />
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Ville" value={info.city} />
                <InfoItem
                  label="Code postal"
                  value={
                    String(info.postalCode) !== 'null'
                      ? String(info.postalCode)
                      : undefined
                  }
                />
              </div>

              <Separator />

              <InfoItem label="Âge" value={info.age?.toString()} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        {label}
      </dt>
      <dd className="text-sm text-zinc-900 dark:text-zinc-100">
        {value || <span className="text-zinc-400 italic">Non renseigné</span>}
      </dd>
    </div>
  );
}
