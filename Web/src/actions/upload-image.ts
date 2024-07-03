"use server";

export default async function uploadImage() {
  await new Promise((r) => setTimeout(r, 500));
  return "/placeholder-image.jpg";
}
