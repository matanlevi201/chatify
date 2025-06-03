import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select"; // Adjust the path accordingly
import { HTMLAttributes } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  name: string;
  options?: Option[];
  defaultVal?: string[]; // Default selected values
  className?: string;
  description?: string;
  maxCount?: number;
  placeholder?: string;
  variant?: string;
  animation?: number;
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function InputMultiSelect({
  label = "",
  name,
  options = [],
  defaultVal,
  className,
  description,
  placeholder,
  disabled,
}: Props) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              defaultValue={field.value ?? defaultVal ?? []}
              onValueChange={field.onChange}
              variant="inverted"
              animation={2}
              maxCount={3}
              placeholder={placeholder}
              className={className}
              disabled={disabled}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

export default InputMultiSelect;
