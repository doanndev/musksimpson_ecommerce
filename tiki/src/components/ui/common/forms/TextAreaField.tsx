import { HStack } from '@/components/utils/h-stack';
import { cn } from '@/lib/utils';
import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material';
import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import { FormField } from './Form';

interface Props<T extends FieldValues> extends Omit<MuiTextFieldProps, 'name' | 'defaultValue'> {
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  labelClassName?: string;
  placeLabel?: 'inside' | 'outside';
  control: Control<T>;
}

export const TextAreaField = <T extends FieldValues>({
  name,
  defaultValue,
  label,
  placeLabel = 'inside',
  labelClassName,
  control,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue as any}
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <HStack noWrap>
          {placeLabel === 'outside' && (
            <label htmlFor={name} className={cn('min-w-[200px]', labelClassName)}>
              {label}
            </label>
          )}

          <MuiTextField
            {...field}
            {...props}
            multiline
            minRows={3}
            error={!!error}
            helperText={error?.message}
            className={cn(
              {
                '[&_.MuiInputBase-root]:!rounded-2xl': props.size === 'medium',
                '[&_.MuiInputBase-root]:!rounded-xl': props.size === 'small',
              },
              props.className
            )}
            fullWidth
            margin='normal'
            label={placeLabel === 'inside' ? label : undefined}
          />
        </HStack>
      )}
    />
  );
};
