import AdminAdsTable from "@/components/admin/admin-ads-table";
import AdminProtected from "@/components/admin/admin-protected";
import React from "react";

function AdminAdsPage() {
  return (
    <AdminProtected>
      {(session) => (
        <>
          <AdminAdsTable />
        </>
      )}
    </AdminProtected>
  );
}

export default AdminAdsPage;
