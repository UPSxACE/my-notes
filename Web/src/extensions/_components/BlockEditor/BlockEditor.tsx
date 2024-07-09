"use client";

import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import "@/styles/index.css";
import { Editor, EditorContent } from "@tiptap/react";
import { KeyboardEvent, RefObject } from "react";
import { ContentItemMenu, LinkMenu, TextMenu } from "../menus";

type Props = {
  editor: Editor | null;
  containerRef: RefObject<HTMLElement>;
};

export const BlockEditor = ({ editor, containerRef }: Props) => {
  if (!editor) {
    return null;
  }

  // NOTE: Not a good practice to override the tab functionality
  function handleTab(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      editor?.commands.insertContent("    ");
    }
  }

  return (
    <div>
      <EditorContent
        onKeyDown={handleTab}
        className="[&>.ProseMirror]:py-8"
        editor={editor}
      />
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
