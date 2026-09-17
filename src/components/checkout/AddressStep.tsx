import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2 } from 'lucide-react';
import { useAddressStore } from '../../store/addressStore';
import { useToast } from '../../hooks/useToast';
import type { AddressType } from '../../types';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  house: z.string().min(1, 'Required'),
  street: z.string().min(1, 'Required'),
  landmark: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  addressType: z.enum(['Home', 'Work', 'Other']),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export function AddressStep({ onContinue }: { onContinue: () => void }) {
  const addresses = useAddressStore((s) => s.addresses);
  const selectedId = useAddressStore((s) => s.selectedId);
  const select = useAddressStore((s) => s.select);
  const remove = useAddressStore((s) => s.remove);
  const add = useAddressStore((s) => s.add);
  const toast = useToast();
  const [showForm, setShowForm] = useState(addresses.length === 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { addressType: 'Home' as AddressType },
  });

  function onSubmit(values: AddressFormValues) {
    add(values);
    toast.show('Address saved');
    reset();
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-space-sm">
        {addresses.map((a) => (
          <label key={a.id} className={`flex items-start gap-3 p-space-md border rounded-lg cursor-pointer ${selectedId === a.id ? 'border-deep-obsidian' : 'border-slate-border'}`}>
            <input type="radio" name="address-select" className="mt-1" checked={selectedId === a.id} onChange={() => select(a.id)} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md font-semibold text-on-surface">{a.fullName}</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-caps text-[10px] uppercase text-on-surface-variant">{a.addressType}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {a.house}, {a.street}
                {a.landmark ? `, ${a.landmark}` : ''}, {a.city}, {a.state} - {a.pincode}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Mobile: {a.mobile}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                remove(a.id);
                toast.show('Address removed');
              }}
              className="text-outline hover:text-error"
            >
              <Trash2 size={20} />
            </button>
          </label>
        ))}
      </div>

      <button onClick={() => setShowForm((v) => !v)} className="self-start font-label-md text-label-md text-deep-obsidian underline underline-offset-4">
        + Add New Address
      </button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-space-sm p-space-md border border-slate-border rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <Field label="Full Name" error={errors.fullName?.message}>
              <input {...register('fullName')} className={inputClass(!!errors.fullName)} />
            </Field>
            <Field label="Mobile Number" error={errors.mobile?.message}>
              <input {...register('mobile')} maxLength={10} className={inputClass(!!errors.mobile)} />
            </Field>
            <Field label="Pincode" error={errors.pincode?.message}>
              <input {...register('pincode')} maxLength={6} className={inputClass(!!errors.pincode)} />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <input {...register('city')} className={inputClass(!!errors.city)} />
            </Field>
            <Field label="State" error={errors.state?.message}>
              <input {...register('state')} className={inputClass(!!errors.state)} />
            </Field>
            <Field label="Landmark (optional)">
              <input {...register('landmark')} className={inputClass(false)} />
            </Field>
          </div>
          <Field label="House / Flat No." error={errors.house?.message}>
            <input {...register('house')} className={inputClass(!!errors.house)} />
          </Field>
          <Field label="Street / Area" error={errors.street?.message}>
            <input {...register('street')} className={inputClass(!!errors.street)} />
          </Field>
          <div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Address Type</p>
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <label key={t} className="flex items-center gap-1.5 font-body-sm text-body-sm">
                  <input type="radio" value={t} {...register('addressType')} defaultChecked={t === 'Home'} /> {t}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="self-start px-6 py-2.5 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors">
            Save Address
          </button>
        </form>
      )}

      <button
        onClick={onContinue}
        disabled={!selectedId}
        className="self-end mt-2 px-8 py-3 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors disabled:opacity-40"
      >
        Continue to Delivery
      </button>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      {children}
      {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `px-3 py-2 border rounded font-body-md text-body-md focus:outline-none focus:border-secondary ${hasError ? 'border-error' : 'border-slate-border'}`;
}
