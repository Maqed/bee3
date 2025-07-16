import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "@/navigation";

async function AdminRoute() {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  redirect("/admin/ads");
}

export default AdminRoute;
