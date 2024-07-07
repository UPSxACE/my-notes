import { twMerge } from "tailwind-merge";
import { BaseButtonProps } from "../base-components/base-button";
import { Button } from "../ui/button";

export default function CtaButton(props: BaseButtonProps) {
  return (
    <Button
      {...props}
      className={twMerge(
        "text-white bg-theme-6 hover:bg-theme-6",
        props.className
      )}
     />
  );
}
