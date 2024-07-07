import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ReactState } from "@/utils/react-state-type";
import { CiFolderOn } from "react-icons/ci";
import FolderSelector from "./folder-selector";

type Props = {
  state: ReactState<string>;
};

export default function Folder(props: Props) {
  const { state } = props;

  return (
    <section className="py-3 px-6">
      <div className="flex items-center mb-2">
        <span className="font-bold text-sm">Folder</span>
      </div>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            {/** TODO: Add popover to see full path + show priority too maybe*/}
            <button className="gap-2 text-base border border-solid w-full text-left p-3 rounded-md text-neutral-500 border-neutral-300 hover:border-theme-4 flex items-center">
              <span className="line-clamp-1 overflow-hidden">
                {state[0] === "/" ? "No folder selected" : state[0]}
              </span>
              <CiFolderOn className="ml-auto text-2xl shrink-0 w-6 h-6" />
            </button>
          </DialogTrigger>
          <FolderSelector state={state} />
        </Dialog>
      </div>
    </section>
  );
}
