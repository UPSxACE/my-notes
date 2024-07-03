import { auth } from "@/auth";
import AppHeader from "@/components/layout/app-header";
import AppSidebar from "@/components/layout/app-sidebar";
import CustomizeAppHeaderProvider from "@/context/customize-app-header";

export default async function RootLayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <CustomizeAppHeaderProvider>
      <div className="flex min-h-screen items-stretch">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          {children}
        </div>
      </div>
    </CustomizeAppHeaderProvider>
  );
}
