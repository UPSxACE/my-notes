"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

type CustomHeaderEnd = {
  customEnd: ReactNode | null;
  setCustomEnd: Dispatch<SetStateAction<ReactNode | null>>;
};

const defaultValue: CustomHeaderEnd = {
  customEnd: null,
  setCustomEnd: (action: SetStateAction<ReactNode | null>) => null,
};

export const CustomizeAppHeaderContext =
  createContext<CustomHeaderEnd>(defaultValue);

export default function CustomizeAppHeaderProvider(props: {
  children: Readonly<ReactNode>;
}) {
  const [customEnd, setCustomEnd] = useState<ReactNode | null>(null);

  return (
    <CustomizeAppHeaderContext.Provider value={{ customEnd, setCustomEnd }}>
      {props.children}
    </CustomizeAppHeaderContext.Provider>
  );
}
