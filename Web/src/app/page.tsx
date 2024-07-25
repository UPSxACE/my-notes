import { auth } from "@/auth";
import DropTargetContextProvider from "./_components/drop-target-context";
import Filters from "./_components/filters";
import Header from "./_components/header";
import Nodes from "./_components/nodes";
import NotesListContextProvider from "./_components/notes-list-context";
import NotesSearchContextProvider from "./_components/notes-search-context";
import HomePageGuest from "./page-guest";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <HomePageGuest />;
  }

  return (
    <main className="font-sans bg-ligrey-0 flex-1 p-6 flex flex-col">
      <NotesListContextProvider>
        <NotesSearchContextProvider>
          <Header />
          <Filters />
          <DropTargetContextProvider>
            <Nodes />
          </DropTargetContextProvider>
        </NotesSearchContextProvider>
      </NotesListContextProvider>
    </main>
  );
}
