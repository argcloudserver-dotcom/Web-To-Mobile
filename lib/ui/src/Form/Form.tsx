import React, { createContext, useContext, useMemo } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import {
  Controller,
  FormProvider,
  useFormContext,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "../Label/Label";
import { useUITheme } from "../theme/UITheme";

/** Re-export of react-hook-form's FormProvider, matching the web `<Form {...form}>` usage. */
export const Form = FormProvider;

interface FormFieldContextValue {
  name: string;
}
const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormFieldState() {
  const fieldContext = useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();
  if (!fieldContext) throw new Error("useFormFieldState must be used within <FormField>");
  return { name: fieldContext.name, ...getFieldState(fieldContext.name, formState) };
}

export const FormItem: React.FC<{ children?: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => {
  const { spacing } = useUITheme();
  return <View style={[{ gap: spacing[1], marginBottom: spacing[3] }, style]}>{children}</View>;
};

export const FormLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { error } = useFormFieldState();
  const { colors } = useUITheme();
  return <Label style={error ? { color: colors.destructive } : undefined}>{children}</Label>;
};

/** Unlike web's Slot-based FormControl, RN just passes children through — invalid state is read via useFormFieldState in the input itself. */
export const FormControl: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const FormDescription: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { colors, typography } = useUITheme();
  return <Text style={{ color: colors.mutedForeground, fontSize: typography.fontSize.xs }}>{children}</Text>;
};

export const FormMessage: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { error } = useFormFieldState();
  const { colors, typography } = useUITheme();
  const message = error ? String(error.message ?? "") : children;
  if (!message) return null;
  return <Text style={{ color: colors.destructive, fontSize: typography.fontSize.xs }}>{message}</Text>;
};

/** Convenience hook for inputs that need to know their own error/invalid state, e.g. to pass `invalid` to <Input>. */
export function useFormFieldInvalid() {
  const { error } = useFormFieldState();
  return !!error;
}
