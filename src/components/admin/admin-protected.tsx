import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AdminProtectedProps {
  children: (
    session: NonNullable<Awaited<ReturnType<typeof getServerAuthSession>>>,
  ) => React.ReactNode;
}

export default async function AdminProtected({
  children,
}: AdminProtectedProps) {
  const session = await getServerAuthSession();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return <>{children(session)}</>;
}
