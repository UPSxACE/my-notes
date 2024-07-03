import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "../../ui/button";

interface Props extends ButtonProps {
  green?: boolean;
}

export default function CtaButton(props: Props) {
  return (
    <Button
      {...props}
      className={twMerge(
        "text-white bg-theme-4 hover:bg-theme-5",
        props.green && "bg-green-600 hover:bg-green-800",
        props.className
      )}
    >
      {props.children}
    </Button>
  );
}
