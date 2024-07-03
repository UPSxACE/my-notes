import GhostTextButton from "@/components/theme/app/ghost-text-button";

export default function InitialPriority() {
  return (
    <section className="py-5 px-6 border-b border-solid border-zinc-200">
      <div className="flex items-center">
        <span className="font-bold text-base">Initial Priority</span>
        <GhostTextButton>Edit</GhostTextButton>
      </div>
      <div>
        <span className="text-xl">5</span>
      </div>
    </section>
  );
}
