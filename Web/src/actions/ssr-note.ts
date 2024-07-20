"use server";

import api from "@/http/server";
import { Note } from "@/gql/graphql";
import getToken from "@/utils/get-token";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function ssrNote(id: string) {
  const token = getToken(cookies());

  if (!token) return notFound();

  const { data } = await api
    .get<Note>("/notes/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .catch((err) => {
      console.log(err?.response?.status);
      // TODO: if error different than 404, redirect to "try again later page"
      return notFound();
    });

  return data;
}
