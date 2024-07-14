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
import { useCreateFolderMutation } from "@/gql/graphql.schema";
import useToggle from "@/hooks/use-toggle";
import getGqlErrorMessage from "@/utils/get-gql-error";
import { notifyError } from "@/utils/toaster-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NotesListContext } from "./notes-list-context";
import { NotesSearchContext } from "./notes-search-context";

type Props = {
  path: string;
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
  const { path, afterSave } = props;
  const { resetCursor } = useContext(NotesListContext);
  const { resetCursor: resetSearchCursor } = useContext(NotesSearchContext);

  const [createFolder] = useCreateFolderMutation({
    //refetchQueries: ["ownNoteTags", "ownFolders", "navigate"],
    update(cache) {
      resetCursor();
      resetSearchCursor();
      // NOTE: one thing cache eviction doesn't do is resetting the cursors!
      // So we have to manually do it whenever the query is in a component that is mounted right now!
      cache.evict({ fieldName: "ownNoteTags" });
      cache.evict({ fieldName: "ownFolders" });
      cache.evict({ fieldName: "navigate" });
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
    let fullPath = path;
    if (fullPath !== "/") fullPath += "/";
    fullPath += values.path;

    setLoading(true);
    createFolder({
      variables: {
        input: {
          path: fullPath,
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
            will be located in <strong>{path}</strong> .
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
