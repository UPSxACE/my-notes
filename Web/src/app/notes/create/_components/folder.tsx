import CtaButton from "@/components/theme/app/cta-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CiFolderOn } from "react-icons/ci";
import { LuSearch } from "react-icons/lu";

export default function Folder() {
  return (
    <section className="py-3 px-6">
      <div className="flex items-center mb-2">
        <span className="font-bold text-base">Folder</span>
      </div>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-base border border-solid w-full text-left p-3 rounded-md text-neutral-500 border-neutral-400 hover:border-theme-4 flex items-center">
              No folder selected
              <CiFolderOn className="ml-auto text-2xl" />
            </button>
          </DialogTrigger>
          <DialogContent className="w-[90svw] max-w-[720px] font-sans gap-0">
            <DialogHeader>
              <DialogTitle>Select folder</DialogTitle>
              <DialogDescription>
                Select the folder to save the note in. Or create a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <div className="flex-1 flex bg-white rounded-md overflow-hidden items-center pl-3 pr-2 border-zinc-200 border border-solid">
                <span className="select-none text-xl">
                  <LuSearch />
                </span>
                <Input
                  placeholder="Search"
                  className="focus-visible:outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 px-[0.4rem]"
                />
              </div>
              <CtaButton green>New Folder</CtaButton>
            </div>
            <Separator className="bg-gray-300 mt-4" />
            <div className="h-[25rem]">
              <button className="flex text-left h-10 hover:bg-gray-100 transition-all duration-200 px-4 text-sm w-full items-center border-solid border-b border-gray-200 [&:nth-of-type(10)]:border-0">
                /
              </button>
            </div>
            <Separator className="bg-gray-300 mt-4" />
            <DialogFooter className="mt-4">
              <CtaButton>Select Folder</CtaButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
