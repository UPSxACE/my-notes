import ssrNote from "@/actions/ssr-note";
import Article from "./_components/article";

type Props = {
  params: { noteId: string };
};

export default async function NoteViewPage({ params }: Props) {
  const noteData = await ssrNote(params.noteId);

  return (
    <main className="flex justify-center p-32">
      <Article data={noteData} />
    </main>
  );
}
