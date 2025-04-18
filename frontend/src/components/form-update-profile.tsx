import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Path, useForm } from "react-hook-form";
import z from "zod";
import { Form } from "./ui/form";
import InputResolver from "./input-resolver";
import { Button, buttonVariants } from "./ui/button";
import { ReactNode } from "react";
import { VariantProps } from "class-variance-authority";

export type Field<K extends FieldValues> = {
  name: Path<K>;
  type: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  description?: string;
};

export type FormButton = {
  name: string;
  type?: "button" | "reset" | "submit";
  action?: (values: SetProfileSchema) => void | Promise<void>;
  isLoading?: boolean;
  loadingIcon?: ReactNode;
  notLoadingIcon?: ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
};

const setProfileSchema = z.object({
  displayName: z.string().min(3, "Name must be minimum 3 chars"),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  avatar: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Avatar must be a file",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File must be <= 10MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(
          file.type
        ),
      {
        message: "File must be an image (jpeg, png, gif, svg)",
      }
    )
    .optional(),
});

export type SetProfileSchema = z.infer<typeof setProfileSchema>;

function FormUpdateProfile({
  inputs,
  buttons,
  defaultValues,
  disabled = false,
  onSubmit,
}: {
  inputs: Field<SetProfileSchema>[];
  buttons: FormButton[];
  defaultValues?: SetProfileSchema;
  disabled?: boolean;
  onSubmit: (formValues: SetProfileSchema) => void | Promise<void>;
}) {
  const form = useForm<SetProfileSchema>({
    resolver: zodResolver(setProfileSchema),
    defaultValues: {
      displayName: defaultValues?.displayName ?? "",
      email: defaultValues?.email ?? undefined,
      bio: defaultValues?.bio ?? "",
    },
  });

  const submit = async (values: SetProfileSchema) => {
    await onSubmit(values);
  };

  const resolveOnClick = (button: FormButton) => {
    switch (button.type) {
      case "submit":
        return undefined;
      case "reset":
        return () => {
          form.reset();
          button.action?.(form.getValues());
        };
      default:
        return () => button.action?.(form.getValues());
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        onReset={() => form.reset()}
        className="flex flex-col space-y-4"
      >
        {inputs.map((input, i) => (
          <InputResolver
            key={`${input.name}_${i}`}
            input={{ ...input, disabled }}
          />
        ))}
        {buttons.length ? (
          <div className="flex gap-2 justify-end">
            {buttons.map((button, i) => (
              <Button
                key={`${button.name}_${i}`}
                onClick={resolveOnClick(button)}
                variant={button.variant}
                className={`${button.className}`}
                type={button.type ?? "button"}
                disabled={button.isLoading}
              >
                {button.name}
                {button.isLoading ? button.loadingIcon : button.notLoadingIcon}
              </Button>
            ))}
          </div>
        ) : (
          <Button type="submit" className="w-full">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}

export default FormUpdateProfile;
