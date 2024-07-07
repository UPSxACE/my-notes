import { ReactNode, isValidElement } from "react";
import { twMerge } from "tailwind-merge";
import { LinkButton, LinkButtonProps } from "../_custom/link-button";
import LoadingSpinner from "../theme/loading-spinner";

export type BaseLinkProps = LinkButtonProps & {
  disabled?: boolean;
  loading?: boolean;
  loadingComponent?: ReactNode;
};

export default function BaseLink(props: BaseLinkProps) {
  const { disabled, loading, loadingComponent, asChild, style, ...restProps } =
    props;

  const renderCustomLoading = loading && loadingComponent;

  if (asChild && isValidElement(props.children)) {
    throw new Error("asChild prop not supported.");
  }

  return (
    <LinkButton
      {...restProps}
      className={twMerge("relative overflow-hidden", props.className)}
      style={disabled || loading ? { ...style, pointerEvents: "none" } : style}
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
    </LinkButton>
  );
}
