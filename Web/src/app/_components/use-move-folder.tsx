"use client";
import { MoveFolderDocument } from "@/gql/graphql";
import {
  Folder as FolderModel,
  MoveFolderInput,
  NavigateQuery,
  Note,
} from "@/gql/graphql.schema";
import gqlClient from "@/http/client";
import { compareUidsV7, sortFoldersByUidAsc } from "@/utils/sorting-helpers";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export default function useMoveFolder(currentPath?: string) {
  const client = useQueryClient();
  const { mutate: moveNote } = useMutation({
    mutationFn: (data: MoveFolderInput) =>
      gqlClient.request(MoveFolderDocument, { input: data }),
    onSuccess: (data, variables) => {
      const updatedFolder = data.moveFolder;
      if (!updatedFolder) throw new Error("An unexpected error has occurred.");

      const lastSlashOfTarget = updatedFolder.path.lastIndexOf("/");

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

          const cachedFoldersFiltered = cachedFolders.filter(
            (x) => x.id !== updatedFolder.id
          );
          // update the target folder too
          const cachedFoldersFixed = cachedFoldersFiltered.map((x) => {
            if (x.path !== variables.targetPath) return x;
            return { ...x, notesCount: x.notesCount + 1 };
          });

          return {
            ...cachedData,
            pages: [
              {
                navigate: {
                  cursor: lastCursor,
                  folders: cachedFoldersFixed,
                  notes: cachedNotes,
                },
              },
            ],
          };
        }
      );

      // add to new path in cache
      client.setQueriesData(
        {
          queryKey: [
            "navigate",
            updatedFolder.path.slice(0, lastSlashOfTarget),
          ],
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

          const lastFolder = cachedFolders[cachedFolders.length - 1];
          const comparisonWithLast = lastFolder
            ? compareUidsV7(updatedFolder.id, lastFolder.id)
            : 0;

          const lastButNoCursor = comparisonWithLast === 1 && !!!lastCursor;
          if (
            lastButNoCursor ||
            comparisonWithLast <= 0 ||
            cachedNotes.length > 0
          ) {
            // if there is no folders (0) or if there is folders, but it would be placed in the middle of them (-1),
            // or if it would be the LAST folder(1), but there is no cursor,
            // OR if notes already started being fetched...
            // then push it to the cache, and then re-sort them
            // FIXME there is an edge case that most likely needs to be fixed: when exactly 16 folders exist,
            // and a 17th just got added, and NO NOTES were fetched yet.
            // (or maybe not because of the 'no cursor' condition)
            cachedFolders.push(updatedFolder);
            cachedFolders = sortFoldersByUidAsc(cachedFolders);
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
