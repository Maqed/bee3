import React from "react";
import AdminProtected from "@/components/admin/admin-protected";
import AdminUsersTable from "@/components/admin/admin-users-table";

function AdminUsersPage() {
  return <AdminProtected>{(session) => <AdminUsersTable />}</AdminProtected>;
}

export default AdminUsersPage;
