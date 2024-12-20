"use client";
import CtaButton from "@/components/theme/app/cta-button";
import { CustomizeAppHeaderContext } from "@/context/customize-app-header";
import BlockEditor from "@/extensions/_components/BlockEditor/BlockEditor";
import useBlockEditor from "@/extensions/_components/BlockEditor/use-block-editor";
import { CreateNoteDocument } from "@/gql/graphql";
import { CreateNoteInput } from "@/gql/graphql.schema";
import gqlClient from "@/http/client";
import { notifyError } from "@/utils/toaster-notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { TagSuggestion } from "react-tag-autocomplete";
import TextareaAutosize from "react-textarea-autosize";
import Sidebar from "./_components/sidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

//   // loading: () => (
// const Editor = dynamic(() => import("./_components/editor"), {
//   ssr: fals,
//   //   <div className="h-0 w-0 overflow-hidden">
//   //     <p>SEO...</p>
//   //   </div>
//   // ),
// });

export default function CreateNotePage() {
  // header
  const { setCustomEnd } = useContext(CustomizeAppHeaderContext);
  // editor
  const containerRef = useRef<HTMLDivElement>(null);
  const { editor, json, text } = useBlockEditor({});
  // gql
  const client = useQueryClient();
  const {
    data,
    reset,
    error,
    isPending,
    isSuccess,
    mutate: createNote,
  } = useMutation({
    mutationFn: (data: CreateNoteInput) =>
      gqlClient.request(CreateNoteDocument, { input: data }),
    onSuccess: (data, variables) => {
      client.invalidateQueries({ queryKey: ["own-note-tags"] });
      client.invalidateQueries({ queryKey: ["own-folders"] });
      client.invalidateQueries({ queryKey: ["navigate"] });
    },
  });

  // state
  const [checking, setChecking] = useState(false);
  const loading = isPending || isSuccess || checking;
  const [valid, setValid] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const priorityRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<TagSuggestion[]>([]);
  const [folder, setFolder] = useState<string>("/");
  // router
  const router = useRouter();

  function validate() {
    const title = titleRef?.current?.value || "";
    setValid(title.length > 3);
  }

  useEffect(() => {
    function handleSave() {
      const priorityValue = Number(priorityRef?.current?.value);
      if (isNaN(priorityValue)) return;
      // validate the priority html input element min/max attributes
      setChecking(true);
      if (!priorityRef.current?.checkValidity()) {
        setChecking(false);
        return priorityRef.current?.reportValidity();
      }

      setChecking(false);
      createNote({
        title: titleRef?.current?.value || "",
        content: JSON.stringify(json || ""),
        contentText: text,
        priority: priorityValue,
        tags: tags.map((x) => x.value?.toString() || ""),
        folderPath: folder,
      });
    }

    setCustomEnd(
      <CtaButton
        disabled={!valid}
        loading={loading}
        className="h-[2rem] px-5"
        onClick={handleSave}
      >
        Save
      </CtaButton>
    );

    return () => setCustomEnd(null);
  }, [
    setCustomEnd,
    loading,
    valid,
    createNote,
    folder,
    json,
    router,
    tags,
    text,
  ]);

  useEffect(() => {
    if (error) {
      notifyError();
    }
    if (isSuccess) {
      router.push("/");
      reset();
    }
  }, [error, isSuccess, reset, router]);

  return (
    <main
      className={clsx(inter.className, "w-full flex h-[calc(100svh-60px)]")}
    >
      <div className="h-full flex-1 min-w-0 p-10 flex flex-col overflow-auto">
        <div className="pl-[4.5rem] pr-8 lg:pl-6 justify-center flex w-full">
          {/* height should be +0.375rem compared to font size */}
          <TextareaAutosize
            onChange={validate}
            ref={titleRef}
            style={{ height: "4.125rem" as any }}
            minRows={1}
            className="p-0 w-full max-w-[42rem] min-h-0 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 border-0 text-5xl resize-none !placeholder-neutral-400 font-bold"
            placeholder="Note title"
          />
        </div>
        <div className="min-h-0 flex-1" ref={containerRef}>
          <BlockEditor editor={editor} containerRef={containerRef} />
        </div>
      </div>
      <Sidebar
        tagsState={[tags, setTags]}
        folderState={[folder, setFolder]}
        priorityRef={priorityRef}
      />
    </main>
  );
}
