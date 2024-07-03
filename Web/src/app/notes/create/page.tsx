"use client";
import CtaButton from "@/components/theme/app/cta-button";
import { CustomizeAppHeaderContext } from "@/context/customize-app-header";
import BlockEditor from "@/extensions/_components/BlockEditor/BlockEditor";
import useBlockEditor from "@/extensions/_components/BlockEditor/use-block-editor";
import clsx from "clsx";
import hljs from "highlight.js";
import { Inter } from "next/font/google";
import { useContext, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Sidebar from "./_components/sidebar";
hljs.configure({ languages: ["javascript"] });

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

// const Editor = dynamic(() => import("./_components/editor"), {
//   ssr: false,
//   // loading: () => (
//   //   <div className="h-0 w-0 overflow-hidden">
//   //     <p>SEO...</p>
//   //   </div>
//   // ),
// });

export default function CreateNotePage() {
  const { customEnd, setCustomEnd } = useContext(CustomizeAppHeaderContext);
  const [savedHtml, setSavedHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { editor, json, text } = useBlockEditor({});

  useEffect(() => {
    setCustomEnd(
      <CtaButton className="h-[2rem] px-5" onClick={() => console.log(json)}>
        Save
      </CtaButton>
    );

    return () => setCustomEnd(null);
  }, [setCustomEnd, savedHtml, editor, json]);

  return (
    <main
      className={clsx(inter.className, "w-full flex h-[calc(100svh-60px)]")}
    >
      <div className="h-full flex-1 min-w-0 p-10 flex flex-col overflow-auto">
        <div className="pl-[4.5rem] pr-8 lg:pl-6 justify-center flex w-full">
          {/* +0.375rem */}
          <TextareaAutosize
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
      <Sidebar />
    </main>
  );
}
