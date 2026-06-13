"use client";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export function Providers({
  children,
  chatEnabled,
}: {
  children: React.ReactNode;
  chatEnabled: boolean;
}) {
  // Only mount CopilotKit when a chat backend (Gemini key) is configured.
  // Without an agent the runtime sync errors, so in zero-cred demo mode the
  // app renders the board canvas without the chat layer.
  if (!chatEnabled) return <>{children}</>;
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={false}>
      {children}
    </CopilotKit>
  );
}
