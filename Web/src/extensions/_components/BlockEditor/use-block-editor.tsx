"use client";

import ExtensionKit from "@/extensions/extension-kit";
import { Content, JSONContent, useEditor } from "@tiptap/react";
import { useRef, useState } from "react";

type Config = {
  initialContent?: Content;
};

export default function useBlockEditor(config: Config) {
  const { current: configRef } = useRef(config);
  const { initialContent } = configRef;

  const [json, setJson] = useState<JSONContent>();
  const [text, setText] = useState("");

  const editor = useEditor({
    extensions: ExtensionKit(),
    content: initialContent,
    onUpdate: ({ editor }) => {
      const json = editor?.getJSON();
      const text = editor?.getText();

      setJson(json);
      setText(text);
    },
  });

  return { editor, json, text };
}
