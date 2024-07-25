"use client";
import { MoveNoteDocument } from "@/gql/graphql";
import {
  Folder as FolderModel,
  MoveNoteInput,
  NavigateQuery,
  Note,
} from "@/gql/graphql.schema";
import gqlClient from "@/http/client";
import {
  biggestDate,
  compareNoteLast,
  sortNotes,
} from "@/utils/sorting-helpers";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { NoteOrderBy } from "../../utils/note-order-by";

export default function useMoveNote(
  currentPath?: string,
  orderBy?: NoteOrderBy,
  hasNextPage?: boolean
) {
  const client = useQueryClient();
  const { mutate: moveNote } = useMutation({
    mutationFn: (data: MoveNoteInput) =>
      gqlClient.request(MoveNoteDocument, { input: data }),
    onSuccess: (data, variables) => {
      const updatedNote = data.moveNote;
      if (!updatedNote) throw new Error("An unexpected error has occurred.");

      client.invalidateQueries({ queryKey: ["own-folders"] });

      // delete from new path in cache
      client.setQueriesData(
        { queryKey: ["navigate", currentPath || ""] },
        (cachedData?: InfiniteData<NavigateQuery>) => {
          if (!cachedData) return;
          // NOTE: the concept of "pages" is not applied to our project, because
          // we are using infinite scroll, so in the end we will merge the cache in one single page anyways
          let cachedFolders: FolderModel[] = [];
          let cachedNotes: Note[] = [];
          let lastCursor: string | null | undefined;
          cachedData.pages.forEach((page) => {
            cachedFolders.push(...page.navigate.folders);
            cachedNotes.push(...page.navigate.notes);
            lastCursor = page.navigate.cursor;
          });

          console.log(updatedNote.id);
          const cachedNotesFiltered = cachedNotes.filter(
            (x) => x.id !== updatedNote.id
          );
          // update the target folder too
          const cachedFoldersFixed = cachedFolders.map((x) => {
            if (x.path !== variables.targetPath) return x;
            return {
              ...x,
              notesCount: x.notesCount + 1,
              lastNoteAdded: x.lastNoteAdded
                ? updatedNote.createdAt
                : biggestDate(x.lastNoteAdded, updatedNote.createdAt),
            };
          });

          return {
            ...cachedData,
            pages: [
              {
                navigate: {
                  cursor: lastCursor,
                  folders: cachedFoldersFixed,
                  notes: cachedNotesFiltered,
                },
              },
            ],
          };
        }
      );

      // add to new path in cache
      client.setQueriesData(
        {
          queryKey: ["navigate", variables.targetPath],
        },
        (cachedData?: InfiniteData<NavigateQuery>) => {
          if (!cachedData) return;

          // NOTE: the concept of "pages" is not applied to our project, because
          // we are using infinite scroll, so in the end we will merge the cache in one single page anyways
          let cachedFolders: FolderModel[] = [];
          let cachedNotes: Note[] = [];
          let lastCursor: string | null | undefined;
          cachedData.pages.forEach((page) => {
            cachedFolders.push(...page.navigate.folders);
            cachedNotes.push(...page.navigate.notes);
            lastCursor = page.navigate.cursor;
          });

          const lastNote = cachedNotes[cachedNotes.length - 1];
          const comparisonWithLast = lastNote
            ? compareNoteLast(cachedNotes, lastNote, orderBy)
            : 0;
          const beforeLastOrLast = comparisonWithLast <= 0;

          const lastButNoCursor = comparisonWithLast === 1 && !!!lastCursor;
          if (lastButNoCursor || beforeLastOrLast || !hasNextPage) {
            // if there is no folders (0) or if there is folders, but it would be placed in the middle of them (-1),
            // or if it would be the LAST folder(1), but there is no cursor,
            // OR if everything is fetched already...
            // then push it to the cache, and then re-sort them
            // FIXME there is an edge case that most likely needs to be fixed: when exactly 16 folders exist,
            // and a 17th just got added, and NO NOTES were fetched yet.
            // (or maybe not because of the 'no cursor' condition)
            cachedNotes.push(updatedNote);
            cachedNotes = sortNotes(cachedNotes, orderBy);
          }

          return {
            ...cachedData,
            pages: [
              {
                navigate: {
                  cursor: lastCursor,
                  folders: cachedFolders,
                  notes: cachedNotes,
                },
              },
            ],
          };
        }
      );
    },
  });

  return moveNote;
}
