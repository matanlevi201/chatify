import { FieldValues, Path } from "react-hook-form";
import { JSX } from "react";

export type Field<K extends FieldValues> = {
  name: Path<K>;
  type: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  description?: string;
  options?: { value: string; label: string; icon: () => JSX.Element }[];
  fileOptions?: string[];
};
