"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function BanWatcher() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // If the user is authenticated but their account is now banned,
    // sign them out immediately and redirect to login with a message.
    if (status === "authenticated" && session?.user?.banned === true) {
      signOut({ callbackUrl: "/login?banned=true" });
    }
  }, [session, status, pathname]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus={true}>
      <BanWatcher />
      {children}
    </SessionProvider>
  );
}
