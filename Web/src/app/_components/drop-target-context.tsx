"use client";
import {
  createContext,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  ReactNode,
  useRef,
} from "react";

type Context = {
  target: MutableRefObject<string | null>;
  onMouseEnter: (targetPath: string) => MouseEventHandler<HTMLDivElement>;
  onMouseLeave: () => MouseEventHandler<HTMLDivElement>;
};

const defaultValue: Context = {
  target: { current: null },
  onMouseEnter: (_) => () => {},
  onMouseLeave: () => () => {},
};

export const DropTargetContext = createContext<Context>(defaultValue);

// NOTE: It's recommended to manually set target to null when the drag interaction starts
// to avoid bugs
export default function DropTargetContextProvider(props: {
  children: Readonly<ReactNode>;
}) {
  const target = useRef<string | null>(null);

  const onMouseEnter =
    (targetPath: string) => (event: MouseEvent<HTMLDivElement>) => {
      target.current = targetPath;
    };

  const onMouseLeave = () => (event: MouseEvent<HTMLDivElement>) => {
    target.current = null;
  };

  return (
    <DropTargetContext.Provider value={{ target, onMouseEnter, onMouseLeave }}>
      {props.children}
    </DropTargetContext.Provider>
  );
}
