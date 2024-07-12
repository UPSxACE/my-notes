import { BaseButtonProps } from "@/components/base-components/base-button";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../../ui/button";

const GhostTextButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return (
      <Button
        variant={"ghost"}
        {...props}
        className={twMerge(
          "font-semibold text-base h-8 px-4 transition-all duration-300",
          props.className
        )}
        ref={ref}
      />
    );
  }
);

GhostTextButton.displayName = "GhostTextButton";
export default GhostTextButton;
