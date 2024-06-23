import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Input, InputProps } from "../ui/input";

const LightInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      className={twMerge(
        "",
        "h-12 text-base p-4 focus-visible:ring-offset-0 focus-visible:ring-0 border-[#c1c1c1]",
        props.className
      )}
    />
  );
});

LightInput.displayName = "LightInput";
export default LightInput;
