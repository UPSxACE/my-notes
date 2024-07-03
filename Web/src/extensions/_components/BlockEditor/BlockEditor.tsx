"use client";

import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import ExtensionKit from "@/extensions/extension-kit";
import "@/styles/index.css";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { RefObject } from "react";
import { ContentItemMenu, LinkMenu, TextMenu } from "../menus";

type Props = {
  editor: Editor | null;
  containerRef: RefObject<HTMLElement>;
};

export const BlockEditor = ({ editor, containerRef }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div>
      <EditorContent className="[&>.ProseMirror]:py-8" editor={editor} />
      <ContentItemMenu editor={editor} />
      <LinkMenu editor={editor} appendTo={containerRef} />
      <TextMenu editor={editor} />
      <ColumnsMenu editor={editor} appendTo={containerRef} />
      <TableRowMenu editor={editor} appendTo={containerRef} />
      <TableColumnMenu editor={editor} appendTo={containerRef} />
      <ImageBlockMenu editor={editor} appendTo={containerRef} />
    </div>
  );
};

export default BlockEditor;
