import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PriorityMode() {
  return (
    <section className="py-5 px-6 border-b border-solid border-zinc-200">
      <div className="flex items-center mb-2">
        <span className="font-bold text-base">Priority Mode</span>
      </div>
      <Tabs defaultValue="simple" className="w-full mb-2">
        <TabsList className="grid w-full grid-cols-2 p-[0.35rem] h-auto">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="progressive">Progressive</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center">
        <span className="text-base">Deadline</span>
        <span className="text-base ml-auto">Priority: 9</span>
      </div>
    </section>
  );
}
