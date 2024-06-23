import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "../ui/button";

interface Props extends ButtonProps {}

export default function LightButton(props: Props) {
  return (
    <Button
      {...props}
      className={twMerge(
        "h-12 text-base bg-theme-7 hover:bg-theme-9",
        props.className
      )}
    />
  );
}
