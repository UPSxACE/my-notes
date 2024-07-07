import BaseInput from "@/components/base-components/base-input";
import { Ref } from "react";

type Props = {
  priorityRef: Ref<HTMLInputElement>;
};

export default function Priority(props: Props) {
  const { priorityRef } = props;
  // border-b border-solid border-zinc-200
  return (
    <section className="py-3 px-6">
      <div className="flex items-center mb-2">
        <span className="font-bold text-sm">Priority</span>
        {/* <GhostTextButton>Edit</GhostTextButton> */}
      </div>
      {/* <div>
        <span className="text-xl">5</span>
      </div> */}
      <BaseInput
        ref={priorityRef}
        type="number"
        defaultValue={5}
        min={0}
        max={99}
        className="h-12 text-base p-3 rounded-md text-neutral-500 border border-solid border-neutral-300 hover:border-theme-4"
      />
    </section>
  );
}
