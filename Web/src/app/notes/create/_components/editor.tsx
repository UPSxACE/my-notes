"use client";
import { Button } from "@/components/ui/button";
import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night-bright.min.css";
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import Block from "./block";
hljs.configure({ languages: ["javascript"] });

type Props = {
  htmlState: [string, Dispatch<SetStateAction<string>>];
};

export default function Editor(props: Props) {
  const [savedHtml, setSavedHtml] = props.htmlState;
  const [counter, setCounter] = useState(0);
  const { current: states } = useRef<Record<string, any>>({});
  const [blocks, setBlocks] = useState<ReactNode[]>([]);

  function save() {
    console.log(states);
  }

  function addEditable() {
    let newId: number;
    setCounter((counter) => {
      newId = counter + 1;
      return newId;
    });

    setBlocks((blocks) => [
      ...blocks,
      <Block key={String(newId)} id={String(newId)} statesRef={states} />,
    ]);
  }

  return (
    <div className="flex flex-col">
      INSTALAR CODEBLOCK DE VOLTA E NAO SE FALA MAIS NISSO!
      <Button className="w-min" onClick={addEditable}>
        create
      </Button>
      <Button className="w-min" onClick={save}>
        save
      </Button>
      {blocks}
    </div>
  );
}
