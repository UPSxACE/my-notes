import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "../ui/button";

interface Props extends ButtonProps {}

export default function CtaButton(props: Props) {
  return (
    <Button
      {...props}
      className={twMerge(
        "text-white bg-theme-6 hover:bg-theme-6",
        props.className
      )}
    >
      {props.children}
    </Button>
  );
}
