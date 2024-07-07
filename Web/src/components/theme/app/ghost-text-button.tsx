import { BaseButtonProps } from "@/components/base-components/base-button";
import { twMerge } from "tailwind-merge";
import { Button } from "../../ui/button";

export default function GhostTextButton(props: BaseButtonProps) {
  return (
    <Button
      variant={"ghost"}
      {...props}
      className={twMerge(
        "font-semibold text-base h-8 px-4 transition-all duration-300",
        props.className
      )}
     />
  );
}
