import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "../../ui/button";

interface Props extends ButtonProps {}

export default function GhostTextButton(props: Props) {
  return (
    <Button
      variant={"ghost"}
      {...props}
      className={twMerge(
        "font-bold text-base ml-auto h-8 px-4 transition-all duration-300",
        props.className
      )}
    >
      {props.children}
    </Button>
  );
}
