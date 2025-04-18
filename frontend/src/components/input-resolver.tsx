import AvatarSelection from "./avatar-selection";
import InputDefault from "./input-default";
import InputTextarea from "./input-textarea";

function InputResolver({ input }: { input: any }) {
  switch (input.type) {
    case "avatar":
      return (
        <AvatarSelection
          key={input.name}
          name={input.name}
          disabled={input.disabled}
        />
      );
    case "textarea":
      return (
        <InputTextarea
          key={input.name}
          label={input.label}
          name={input.name}
          placeholder={input.placeholder}
          disabled={input.disabled || input.readOnly}
          readOnly={input.readOnly}
        />
      );
    default:
      return (
        <InputDefault
          key={input.name}
          label={input.label}
          name={input.name}
          placeholder={input.placeholder}
          disabled={input.disabled || input.readOnly}
          readOnly={input.readOnly}
          description={input.description}
        />
      );
  }
}

export default InputResolver;
