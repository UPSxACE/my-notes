import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Input, InputProps } from "../ui/input";

const BaseInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      className={twMerge(
        "focus-visible:ring-offset-0 focus-visible:ring-0",
        props.className
      )}
    />
  );
});

BaseInput.displayName = "BaseInput";
export default BaseInput;
