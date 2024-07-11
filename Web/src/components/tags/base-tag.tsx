import { MouseEventHandler } from "react";
import { twJoin } from "tailwind-merge";

type Props = {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function BaseTag(props: Props) {
  return (
    <button
      className={twJoin(
        "h-7 py-[0.125rem] px-[0.55rem] rounded-md bg-gray-100 text-zinc-500 text-sm font-medium",
        !props.onClick && "pointer-events-none select-none"
      )}
    >
      {props.text}
    </button>
  );
}
