import { auth } from "@/auth";
import HomePageGuest from "./page-guest";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <HomePageGuest />;
  }

  return <main>Logged in!</main>;
}
