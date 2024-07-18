"use client";

import BaseInput from "@/components/base-components/base-input";
import CtaButton from "@/components/theme/app/cta-button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  NavigateDocument,
  NavigateQuery,
  useCreateFolderMutation,
} from "@/gql/graphql.schema";
import useToggle from "@/hooks/use-toggle";
import getGqlErrorMessage from "@/utils/get-gql-error";
import { compareUidsV7, sortFoldersByUidAsc } from "@/utils/sorting-helpers";
import { notifyError } from "@/utils/toaster-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NotesListContext } from "./notes-list-context";
import { NotesSearchContext } from "./notes-search-context";

type Props = {
  path?: string;
  orderBy?: string;
  direction?: string;
  afterSave: () => void;
};

const formSchema = z.object({
  path: z.string().regex(
    /[^\/\\.]+/, // Does not allow any /, \ or .
    "Please remove any slashes or dots from the name of the folder"
  ),
  priority: z.coerce
    .number({ message: "Priority must be a number between 0 and 99" })
    .min(0, "Priority must be a number between 0 and 99")
    .max(99, "Priority must be a number between 0 and 99"),
});

export default function NewFolderDialog(props: Props) {
  const { path, orderBy, direction, afterSave } = props;
  const { resetCursor } = useContext(NotesListContext);
  const { search, resetCursor: resetSearchCursor } =
    useContext(NotesSearchContext);

  const [createFolder, { client }] = useCreateFolderMutation({
    update(cache, result, { context, variables }) {
      // resetCursor();
      // resetSearchCursor();
      // cache.evict({ fieldName: "navigate" });

      cache.evict({
        fieldName: "ownFolders",
      });

      resetSearchCursor();
      if (search !== "") {
        cache.evict({
          fieldName: "navigate",
        });
        cache.evict({
          fieldName: "search-note",
        });

        // NOTE: one thing cache eviction doesn't do is resetting the cursors!
        // So we have to manually do it whenever the query is in a component that is mounted right now, and not being used!
        // (If it is being used, then update the cache instead; this specific case is an exception, because it doesn't matter
        // if we just force a refresh by both evicting the cache and resetting the cursor in a search after a creation of something)
        resetCursor();
        return;
      }

      const createdFolder = result.data?.createFolder;

      const currentCache = cache.readQuery<NavigateQuery>({
        query: NavigateDocument,
        variables: { input: { orderBy, path, direction } },
      });

      // Array must be reconstructed, because it is a readonly reference
      let updatedFolders = Array.from(currentCache?.navigate.folders || []);
      const updatedNotes = Array.from(currentCache?.navigate.notes || []);

      if (!createdFolder) throw new Error("An unexpected error has occurred.");

      const lastFolder = updatedFolders[updatedFolders.length - 1];
      const comparisonWithLast = lastFolder
        ? compareUidsV7(createdFolder.id, lastFolder.id)
        : 0;
      if (comparisonWithLast <= 0 || updatedNotes.length > 0) {
        // if there is no folders (0) or if there is folders, but it would be placed in the middle of them (-1),~
        // OR if notes already started being fetched...
        // then push it to the cache, and then re-sort them
        // FIXME there is an edge case that most likely needs to be fixed: when exactly 16 folders exist, 
        // and a 17th just got added, and NO NOTES were fetched yet.
        updatedFolders.push(createdFolder);
        updatedFolders = sortFoldersByUidAsc(updatedFolders);
      }

      cache.evict({
        fieldName: "navigate",
        broadcast: false,
      });

      const currentData = {
        navigate: {
          cursor: currentCache?.navigate.cursor,
          folders: updatedFolders,
          notes: updatedNotes,
        },
      };

      cache.writeQuery({
        query: NavigateDocument,
        variables: {
          input: {
            orderBy,
            path,
            direction,
          },
        },
        data: currentData,
      });
    },
  });
  const [loading, setLoading] = useToggle(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      path: "",
      priority: 5,
    },
  });

  const saveFolder = (values: z.infer<typeof formSchema>) => {
    let fullPath = path || "/";
    if (fullPath !== "/") fullPath += "/";
    fullPath += values.path;

    setLoading(true);
    createFolder({
      variables: {
        input: {
          path: fullPath || "/",
          priority: values.priority,
        },
      },
    })
      .then(async (result) => {
        setLoading(false);
        form.reset();
        afterSave();
      })
      .catch((e) => {
        notifyError();
        console.log(getGqlErrorMessage(e));
        setLoading(false);
      });
  };

  return (
    <DialogContent className="font-sans gap-0 p-0 border-0 !rounded-md bg-transparent shadow-none max-w-none w-fit">
      <div
        className={
          "bg-white overflow-hidden shadow-md rounded-md w-[90svw] max-w-[440px]"
        }
      >
        <DialogHeader className="p-6 px-6">
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to save notes on a different path. The folder
            will be located in <strong>{path || "/"}</strong> .
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="new-folder-form"
            onSubmit={form.handleSubmit(saveFolder)}
            className="grid gap-x-4 pb-4 px-6 grid-cols-[minmax(80px,auto)_1fr] items-center"
          >
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => {
                return (
                  <>
                    <Label htmlFor="path" className="text-right">
                      Name
                    </Label>
                    <FormControl>
                      <BaseInput id="path" required {...field} />
                    </FormControl>
                    <FormMessage className="!mt-2 col-span-2" />
                  </>
                );
              }}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => {
                return (
                  <>
                    <Label htmlFor="priority" className="text-right mt-3">
                      Priority
                    </Label>
                    <FormControl>
                      <BaseInput
                        className="mt-3"
                        id="priority"
                        required
                        min={0}
                        max={99}
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="!mt-2 col-span-2 text-right" />
                  </>
                );
              }}
            />
          </form>
        </Form>
        <div className="p-6 pt-0 flex items-center flex-wrap">
          <CtaButton
            loading={loading}
            className="ml-auto"
            type="submit"
            form="new-folder-form"
          >
            Save Folder
          </CtaButton>
        </div>
      </div>
    </DialogContent>
  );
}
