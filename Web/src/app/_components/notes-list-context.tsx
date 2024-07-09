"use client";
import { PathNodes } from "@/gql/graphql";
import { ApolloError } from "@apollo/client";
import { ReactNode, createContext } from "react";
import useQueryNavigate from "./use-query-navigate";

type Context = {
  data: PathNodes;
  fetchMore: () => void;
  loading: boolean;
  error?: ApolloError;
  endOfResults: boolean;
};

const defaultValue: Context = {
  data: { cursor: null, folders: [], notes: [] },
  fetchMore: () => {},
  loading: true,
  endOfResults: false,
};

export const NotesListContext = createContext<Context>(defaultValue);

export default function NotesListContextProvider(props: {
  children: Readonly<ReactNode>;
}) {
  const {
    data = defaultValue.data,
    error,
    loading,
    fetchMore,
    endOfResults,
  } = useQueryNavigate();

  return (
    <NotesListContext.Provider
      value={{ data, fetchMore, loading, error, endOfResults }}
    >
      {props.children}
    </NotesListContext.Provider>
  );
}
