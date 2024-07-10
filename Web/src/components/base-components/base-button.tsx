import { ReactNode, isValidElement } from "react";
import { twMerge } from "tailwind-merge";
import LoadingSpinner from "../theme/loading-spinner";
import { Button, ButtonProps } from "../ui/button";

export type BaseButtonProps = ButtonProps & {
  loading?: boolean;
  loadingComponent?: ReactNode;
  grey?: boolean;
};

export default function BaseButton(props: BaseButtonProps) {
  const { grey, loading, loadingComponent, asChild, ...restProps } = props;

  const renderCustomLoading = loading && loadingComponent;

  if (asChild && isValidElement(props.children)) {
    throw new Error(
      "asChild prop not supported. If you need an anchor tag, use BaseLink"
    );
  }

  return (
    <Button
      disabled={loading}
      {...restProps}
      className={twMerge(
        "relative overflow-hidden",
        grey && "bg-gray-150 hover:bg-neutral-200 text-black",
        props.className
      )}
    >
      <div
        className={twMerge(
          "relative translate-y-0 transition-all duration-200",
          loading && !renderCustomLoading && "-translate-y-full py-[inherit]"
        )}
      >
        {renderCustomLoading ? loadingComponent : props.children}
      </div>
      {!loadingComponent && (
        <div
          className={twMerge(
            "absolute w-full h-full flex justify-center items-center translate-y-full py-[inherit] transition-all duration-200",
            loading && "translate-y-0"
          )}
        >
          <LoadingSpinner className="w-5 h-5" />
        </div>
      )}
    </Button>
  );
}
