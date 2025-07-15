import AdminProtected from "@/components/admin/admin-protected";
import React from "react";

function AdminAdsPage() {
  return <AdminProtected>{(session) => <></>}</AdminProtected>;
}

export default AdminAdsPage;
