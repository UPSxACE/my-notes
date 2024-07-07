import { twMerge } from "tailwind-merge";
import BaseButton, { BaseButtonProps } from "../base-components/base-button";

export default function LightButton(props: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      className={twMerge(
        "h-12 text-base bg-theme-7 hover:bg-theme-9",
        props.className
      )}
    />
  );
}
