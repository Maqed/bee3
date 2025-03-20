"use client";
import { useTransition } from "react";
import EditAccountSection from "./edit-section";

import React from "react";

function UserSettingsForm() {
  const [isPending, startTransition] = useTransition();
  return (
    <main className="container mt-4 sm:mx-auto md:max-w-4xl">
      <EditAccountSection
        isPending={isPending}
        startTransition={startTransition}
      />
    </main>
  );
}

export default UserSettingsForm;
