import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "./ui/textarea";

type Props = {
  label?: string;
  name: string;
  defaultVal?: string | number | never[];
  className?: string;
} & InputHTMLAttributes<HTMLTextAreaElement>;

function InputTextarea({
  label = "",
  name,
  defaultVal,
  className,
  ...props
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
            <Textarea
              id={name}
              className={`${className}`}
              {...props}
              {...field}
              value={field.value ?? defaultVal ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InputTextarea;
