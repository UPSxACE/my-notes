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
import { CreateFolderDocument } from "@/gql/graphql";
import {
  CreateFolderInput,
  Folder,
  NavigateQuery,
  Note,
} from "@/gql/graphql.schema";
import gqlClient from "@/http/client";
import getGqlErrorMessage from "@/utils/get-gql-error";
import { compareUidsV7, sortFoldersByUidAsc } from "@/utils/sorting-helpers";
import { notifyError } from "@/utils/toaster-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const client = useQueryClient();

  const {
    data,
    reset,
    error,
    isPending,
    isSuccess,
    mutate: createFolder,
  } = useMutation({
    mutationFn: (data: CreateFolderInput) =>
      gqlClient.request(CreateFolderDocument, { input: data }),
    onSuccess: (data, variables) => {
      const createdFolder = data.createFolder;
      if (!createdFolder) throw new Error("An unexpected error has occurred.");

      client.invalidateQueries({ queryKey: ["own-folders"] });
      client.setQueriesData(
        { queryKey: ["navigate"] },
        (cachedData?: InfiniteData<NavigateQuery>) => {
          if (!cachedData) return;

          // NOTE: the concept of "pages" is not applied to our project, because
          // we are using infinite scroll, so in the end we will merge the cache in one single page anyways
          let cachedFolders: Folder[] = [];
          let cachedNotes: Note[] = [];
          let lastCursor: string | null | undefined;
          cachedData.pages.forEach((page) => {
            cachedFolders.push(...page.navigate.folders);
            cachedNotes.push(...page.navigate.notes);
            lastCursor = page.navigate.cursor;
          });

          const lastFolder = cachedFolders[cachedFolders.length - 1];
          const comparisonWithLast = lastFolder
            ? compareUidsV7(createdFolder.id, lastFolder.id)
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
            cachedFolders.push(createdFolder);
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

  const loading = isPending || isSuccess;

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

    createFolder({
      path: fullPath || "/",
      priority: values.priority,
    });
  };

  useEffect(() => {
    if (error) {
      notifyError();
      console.log(getGqlErrorMessage(error)); //FIXME remove all of these(deprecated), or replace them by a better one
    }
    if (isSuccess) {
      form.reset();
      reset();
      afterSave();
    }
  }, [error, isSuccess, afterSave, form, reset]);

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
