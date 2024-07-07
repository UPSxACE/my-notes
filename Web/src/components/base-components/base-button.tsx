import { ReactNode, isValidElement } from "react";
import { twMerge } from "tailwind-merge";
import LoadingSpinner from "../theme/loading-spinner";
import { Button, ButtonProps } from "../ui/button";

export type BaseButtonProps = ButtonProps & {
  loading?: boolean;
  loadingComponent?: ReactNode;
};

export default function BaseButton(props: BaseButtonProps) {
  const { loading, loadingComponent, asChild, ...restProps } = props;

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
      className={twMerge("relative overflow-hidden", props.className)}
    >
      <div
        className={twMerge(
          "relative top-0 transition-all duration-200",
          loading && !renderCustomLoading && "top-[-120%]"
        )}
      >
        {renderCustomLoading ? loadingComponent : props.children}
      </div>
      {!loadingComponent && (
        <div
          className={twMerge(
            "absolute w-full h-full flex justify-center items-center top-[120%] transition-all duration-200",
            loading && "top-0"
          )}
        >
          <LoadingSpinner className="w-5 h-5" />
        </div>
      )}
    </Button>
  );
}
