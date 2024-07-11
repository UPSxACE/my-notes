"use client";

import { CustomizeAppHeaderContext } from "@/context/customize-app-header";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useContext } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function AppHeader() {
  const path = usePathname();
  const show = isVisible(path);
  let breadcrumbItems = breadcrumbsMatcher(path);

  const { customEnd, setCustomEnd } = useContext(CustomizeAppHeaderContext);

  return (
    <div
      className={clsx(
        "sticky top-0 font-sans overflow-hidden transition-all duration-500 delay-300 shrink-0 bg-white z-10",
        show ? "h-[60px] opacity-100" : "h-0 opacity-0"
      )}
    >
      <div
        className={clsx(
          "w-full border-solid  transition-[border-width] duration-500 h-full",
          show ? "border-b" : "border-b-0"
        )}
      >
        <div className="flex items-center px-6 h-[60px] border-solid border-b border-zinc-200">
          <Breadcrumb>
            <BreadcrumbList className="text-base font-medium">
              <BreadcrumbItem>
                <Link className="hover:text-black" href="/">
                  App
                </Link>
              </BreadcrumbItem>
              {breadcrumbItems.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem key={index}>
                      <Link
                        className={clsx(
                          "hover:text-black",
                          item.active && "text-black"
                        )}
                        href={item.link}
                      >
                        {item.name}
                      </Link>
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex gap-2">
            {customEnd || (
              <>
                <button className="text-2xl">
                  <IoMdNotificationsOutline />
                </button>
                <Avatar>
                  <AvatarImage src={undefined} alt="User avatar" />
                  <AvatarFallback className="select-none">US</AvatarFallback>
                </Avatar>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type BreadcumbItemObj = {
  name: string;
  link: string;
  active?: boolean;
};

function breadcrumbsMatcher(path: string): BreadcumbItemObj[] {
  let generalizedPath = path;
  if (path.startsWith("/notes/view")) generalizedPath = "/notes/view";

  switch (generalizedPath) {
    case "/":
      return [{ name: "Notes", link: "/", active: true }];
    case "/notes/create":
      return [
        { name: "Notes", link: "/" },
        {
          name: "Create",
          link: "/notes/create",
          active: true,
        },
      ];
    case "/notes/view":
      return [
        { name: "Notes", link: "/" },
        {
          name: "View Note",
          link: path,
          active: true,
        },
      ];
    default:
      return [];
  }
}

function isVisible(path: string) {
  switch (path) {
    default:
      return true;
  }
}
