import { Input } from "@/components/ui/input";
import { CurrencyInput as ReactCurrencyInput } from "react-currency-mask";
import { forwardRef } from "react";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number;
  onChange?: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, onBlur, onFocus, ...props }, ref) => {
    return (
      <ReactCurrencyInput
        value={value}
        onChangeValue={(event, originalValue) => {
          onChange?.(Number(originalValue));
        }}
        onBlur={(event) => {
          onBlur?.(event as React.FocusEvent<HTMLInputElement>);
        }}
        onFocus={(event) => {
          onFocus?.(event as React.FocusEvent<HTMLInputElement>);
        }}
        currency="BRL"
        locale="pt-BR"
        hideSymbol={false}
        autoSelect={true}
        InputElement={<Input ref={ref} placeholder="R$ 0,00" {...props} />}
      />
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";
