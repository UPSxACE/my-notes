import BaseButton, {
  BaseButtonProps,
} from "@/components/base-components/base-button";
import { twMerge } from "tailwind-merge";

type Props = BaseButtonProps & {
  green?: boolean;
  square?: boolean;
};

export default function CtaButton(props: Props) {
  const { green, square, ...restProps } = props;
  return (
    <BaseButton
      {...restProps}
      className={twMerge(
        "text-white bg-theme-4 hover:bg-theme-5 transition-all duration-300",
        props.green && "bg-green-600 hover:bg-green-800",
        props.square && "rounded-none",
        props.className
      )}
    />
  );
}
