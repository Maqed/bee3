import AdminProtected from "@/components/admin/AdminProtected";
import React from "react";

function AdminAdsPage() {
  return <AdminProtected>{(session) => <></>}</AdminProtected>;
}

export default AdminAdsPage;
