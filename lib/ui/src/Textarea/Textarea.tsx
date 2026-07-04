import React from "react";
import { Input, type InputProps } from "../Input/Input";

export interface TextareaProps extends InputProps {
  numberOfLines?: number;
}

export const Textarea = React.forwardRef<any, TextareaProps>(
  ({ numberOfLines = 4, style, ...rest }, ref) => (
    <Input
      ref={ref}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      style={[{ minHeight: 24 * numberOfLines * 0.6 + 16 }, style]}
      {...rest}
    />
  )
);
Textarea.displayName = "Textarea";
