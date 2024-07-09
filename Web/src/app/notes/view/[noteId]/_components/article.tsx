"use client";
import ExtensionKit from "@/extensions/extension-kit";
import { generateHTML } from "@tiptap/html";
import parse from "html-react-parser";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/plugins/line-numbers/prism-line-numbers.css"; //FIXME

import BaseButton from "@/components/base-components/base-button";
import { Note } from "@/gql/graphql";
import { toDateMDYString } from "@/utils/date-format";
import { useEffect } from "react";
import "./prism.css";

export default function Article({ data }: { data: Note }) {
  const html = generateHTML(JSON.parse(data.content || ""), ExtensionKit());

  const htmlParsed = parse(html, {
    replace: (domNode, index) => {
      const language = "jsx";
      if (domNode.type === "tag" && domNode.name === "pre") {
        domNode.attribs["tabindex"] = "0";
        domNode.attribs["class"] = `line-numbers language-${language}`;
        return;
      }

      if (domNode.type === "tag" && domNode.name === "code") {
        if (domNode.children[0].type === "text") {
          const pris = Prism.highlight(
            domNode.children[0].data,
            Prism.languages.jsx,
            "jsx"
          );

          return <code className={`language-${language}`}>{parse(pris)}</code>;
        }
      }
    },
  });

  useEffect(() => {
    async function lineNumbers() {
      // @ts-ignore
      await import("prismjs/plugins/line-numbers/prism-line-numbers.js");
      Prism.highlightAll();
    }

    lineNumbers();
  }, []);

  console.log(data);

  const createdAtMdyString = toDateMDYString(new Date(data.createdAt));

  return (
    <article className="w-full max-w-screen-lg">
      <header className="flex items-center flex-col gap-1 mb-6">
        <span className="text-center text-zinc-500  font-medium">
          {createdAtMdyString}
        </span>
        <h1 className="text-center font-bold text-4xl">{data.title}</h1>
        {data.tags.length > 0 && (
          <div className="flex gap-2 justify-center mt-2">
            {data.tags.map((tag) => (
              <BaseButton className="px-3 py-2 h-auto" grey key={tag}>
                {tag}
              </BaseButton>
            ))}
          </div>
        )}
      </header>
      {htmlParsed}
    </article>
  );
}
