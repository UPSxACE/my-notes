"use client";

import BaseInput from "@/components/base-components/base-input";
import CtaButton from "@/components/theme/app/cta-button";
import {
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
import { CreateFolderInput } from "@/gql/graphql.schema";
import gqlClient from "@/http/client";
import getGqlErrorMessage from "@/utils/get-gql-error";
import { ReactState } from "@/utils/react-state-type";
import { notifyError } from "@/utils/toaster-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Flipped } from "react-flip-toolkit";
import { useForm } from "react-hook-form";
import { BiArrowBack } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

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

type Props = {
  visibleClass: string;
  visible: boolean;
  changeToDefault: () => void;
  folderState: ReactState<string>;
  localSelectionState: ReactState<string>;
  selectorLoading: boolean;
};

export default function NewFolderDialog(props: Props) {
  const {
    visible,
    visibleClass,
    changeToDefault,
    folderState,
    localSelectionState,
    selectorLoading,
    ...rest
  } = props;

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
      client.invalidateQueries({ queryKey: ["navigate"] });
    },
  });

  const loading = isPending || isSuccess;

  const [_, setFolder] = folderState;
  const [localSelection, setLocalSelection] = localSelectionState;
  // Use useRef here so it doesn't show the new folder path in the rendered text
  // when transitioning out of the new folder dialog after creating a new folder and
  // updating the local selections state
  const pathToSave = useRef<string>(localSelection);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      path: "",
      priority: 5,
    },
  });

  const saveFolder = (values: z.infer<typeof formSchema>) => {
    let fullPath = pathToSave.current;
    if (fullPath !== "/") fullPath += "/";
    fullPath += values.path;

    createFolder({
      path: fullPath,
      priority: values.priority,
    });
  };

  const newFolderPath = data?.createFolder?.path;
  useEffect(() => {
    if (error) {
      notifyError();
      console.log(getGqlErrorMessage(error)); //FIXME remove all of these(deprecated), or replace them by a better one
    }
    if (isSuccess) {
      form.reset();
      reset();
      if (newFolderPath) {
        setFolder(newFolderPath);
        setLocalSelection(newFolderPath);
      }
      changeToDefault();
    }
  }, [
    error,
    isSuccess,
    form,
    reset,
    newFolderPath,
    setFolder,
    setLocalSelection,
    changeToDefault,
  ]);

  return (
    <div className={"bg-white overflow-hidden shadow-md rounded-md"} {...rest}>
      <Flipped inverseFlipId="wrapper">
        <div className={twMerge("w-[90svw] max-w-[440px]", visibleClass)}>
          <DialogHeader className="p-6 px-6">
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to save notes on a different path. The folder
              will be located in <strong>{pathToSave.current}</strong> .
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
            <button
              className="flex items-center text-lg p-2 pl-3 pr-4 transition-color duration-200 hover:bg-gray-100 rounded-md"
              onClick={changeToDefault}
            >
              <BiArrowBack />{" "}
              <span className="ml-1 font-medium text-base">Back</span>
            </button>
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
      </Flipped>
    </div>
  );
}
