import React from "react";
import { Stack } from "@fluentui/react";

export const CenteredContent = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </Stack>
  );
};
