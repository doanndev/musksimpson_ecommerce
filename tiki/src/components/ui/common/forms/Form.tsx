import React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

export interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T, any>;
  onSubmit?: SubmitHandler<T>;
  children?: React.ReactNode;
  formId?: string;
  className?: string;
}

const FormWrapper = <TFormValue extends FieldValues>({
  form,
  onSubmit,
  children,
  formId = 'form-submit-wrapper',
  className,
}: FormWrapperProps<TFormValue>) => {
  return (
    <FormProvider {...form}>
      <form
        className={className}
        id={formId}
        onSubmit={(e) => {
          console.log('Form submitted'); // Debug
          form.handleSubmit(onSubmit as SubmitHandler<TFormValue>)(e);
        }}
      >
        {children}
      </form>
    </FormProvider>
  );
};

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export { FormField, FormWrapper };
