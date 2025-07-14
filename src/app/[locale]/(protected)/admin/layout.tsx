import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="container py-6 ps-1 pt-1">
        <SidebarTrigger />
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
