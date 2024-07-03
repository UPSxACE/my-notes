import GhostTextButton from "@/components/theme/app/ghost-text-button";

export default function Priority() {
  // border-b border-solid border-zinc-200
  return (
    <section className="py-3 px-6">
      <div className="flex items-center">
        <span className="font-bold text-base">Priority</span>
        <GhostTextButton>Edit</GhostTextButton>
      </div>
      <div>
        <span className="text-xl">5</span>
      </div>
    </section>
  );
}
