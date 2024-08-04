import ServerSideProviders from "./server-side";
import ClientSideProviders from "./client-side";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Providers({ children }: Props) {
  return (
    <ServerSideProviders>
      <ClientSideProviders>{children}</ClientSideProviders>
    </ServerSideProviders>
  );
}

export default Providers;
