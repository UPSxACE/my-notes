import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import BaseInput from "../base-components/base-input";
import { InputProps } from "../ui/input";

const LightInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <BaseInput
      {...props}
      ref={ref}
      className={twMerge(
        "h-12 text-base p-4 border-[#c1c1c1]",
        props.className
      )}
    />
  );
});

LightInput.displayName = "LightInput";
export default LightInput;
