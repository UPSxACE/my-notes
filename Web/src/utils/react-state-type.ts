export type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type ReactStateValue<T> = ReactState<T>[0];
export type ReactSetState<T> = ReactState<T>[1];
