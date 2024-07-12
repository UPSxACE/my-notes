"use client";

import BaseTag from "@/components/tags/base-tag";
import GhostTextButton from "@/components/theme/app/ghost-text-button";
import { Note } from "@/gql/graphql.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  tags: Note["tags"];
};

export default function NoteTags(props: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const remainingRef = useRef<HTMLDivElement | null>(null);

  const [innerFinalWidth, setInnerFinalWidth] = useState(0);
  const [hiddenTagsCount, setHiddenTagsCount] = useState(0);

  const measure = useCallback(() => {
    if (!wrapperRef.current || !innerRef.current || !remainingRef.current) {
      return;
    }

    const children = Array.from(innerRef.current.children);
    const wrapperLeft = wrapperRef.current.getBoundingClientRect().left;
    const wrapperRight = wrapperRef.current.getBoundingClientRect().right;
    const remainingWidth = remainingRef.current.getBoundingClientRect().width;
    const innerMaxRight = wrapperRight - remainingWidth;

    let _innerFinalWidth = 0;
    let _lastVisible = -1;

    children.forEach((child, i) => {
      const childRight = child.getBoundingClientRect().right;
      if (childRight <= innerMaxRight) {
        _innerFinalWidth = childRight - wrapperLeft;
        _lastVisible = i;
      }
    });

    setInnerFinalWidth(_innerFinalWidth);
    setHiddenTagsCount(children.length - _lastVisible - 1);
  }, []);

  useEffect(() => {
    const handleResize = debounce(measure, 100);
    window.addEventListener("resize", handleResize);

    // Initial measurement
    measure();
    // REVIEW: measure again after 1 second after mounting, because of page transition
    // (might not be needed after transitions are properly programmed?)
    const timeout = setTimeout(() => {
      measure();
    }, 800);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [measure]);

  return (
    <div
      ref={wrapperRef}
      className="flex overflow-hidden items-center border-solid border-b border-zinc-200 h-10 pb-2 pt-1 mb-[0.35rem]"
    >
      <div
        ref={innerRef}
        style={{ width: innerFinalWidth }}
        className="flex flex-grow-0 flex-shrink gap-[0.35rem] overflow-hidden items-center"
      >
        {props.tags.map((tag, index) => {
          return <BaseTag key={index} text={"#" + tag} />;
        })}
      </div>
      <div className="pl-[0.35rem]" ref={remainingRef}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <GhostTextButton
              className={
                "px-2 h-7 rounded-md text-gray-600 " +
                (hiddenTagsCount > 0
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none select-none")
              }
            >
              +{hiddenTagsCount}
            </GhostTextButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40 bg-white border border-solid border-zinc-200 shadow-sm px-1 py-[0.35rem] rounded-md">
            {props.tags.slice(-hiddenTagsCount).map((hiddenTag, index) => (
              <DropdownMenuItem
                key={index}
                className="px-2 py-1 hover:bg-zinc-100 transition-all duration-100 rounded-md"
                onClick={() => {
                  //FIXME
                }}
              >
                <span>#{hiddenTag}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
