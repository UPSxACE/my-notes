import SpinnerSkCircle from "@/components/spinners/sk-circle";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactState } from "@/utils/react-state-type";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import NewFolderDialog from "./new-folder-dialog";
import SelectFolderDialog from "./select-folder-dialog";
import useChangeMode from "./use-change-mode";
import useQueryFolders from "./use-query-folders";

enum Mode {
  Default,
  NewFolder,
}

type Props = {
  state: ReactState<string>;
};

export default function FolderSelector(props: Props) {
  const [folder] = props.state;
  const [localSelection, setLocalSelection] = useState(folder);

  const { visible, setVisibility, visibleClass, mode, changeMode, resetMode } =
    useChangeMode(localSelection);

  const onFlipperComplete = () => setVisibility(true); // the end of the transition must be triggered manually

  function reset() {
    // reset local selection and opacity on unmount/blur
    resetMode();
    setLocalSelection(folder);
  }

  const { data, loading, error } = useQueryFolders();

  if ((mode === Mode.Default && loading) || error) {
    return (
      <DialogContent
        key="0" // force rerender without transition
        removeDefaultClose
        className="bg-transparent shadow-none border-none"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Loading...</DialogTitle>
          <DialogDescription>
            Wait until it finishes loading...
          </DialogDescription>
        </VisuallyHidden.Root>
        <SpinnerSkCircle className="!h-14 !w-14" />
      </DialogContent>
    );
  }

  return (
    <DialogContent
      key="1" // force rerender without transition (unless from default mode to new folder mode)
      removeDefaultClose
      className="font-sans gap-0 p-0 border-0 !rounded-md bg-transparent shadow-none max-w-none w-fit"
      onCloseAutoFocus={reset}
    >
      <Flipper flipKey={mode === Mode.NewFolder} onComplete={onFlipperComplete}>
        <Flipped flipId="wrapper">
          {mode === Mode.Default ? (
            <SelectFolderDialog
              localSelectionState={[localSelection, setLocalSelection]}
              folders={data}
              folderState={props.state}
              visible={visible}
              visibleClass={visibleClass}
              onNewFolderClick={changeMode(Mode.NewFolder)}
            />
          ) : (
            <NewFolderDialog
              changeToDefault={changeMode(Mode.Default)}
              visible={visible}
              visibleClass={visibleClass}
              folderState={props.state}
              localSelectionState={[localSelection, setLocalSelection]}
              selectorLoading={loading}
              // refetchFolders={refetch}
            />
          )}
        </Flipped>
      </Flipper>
    </DialogContent>
  );
}
