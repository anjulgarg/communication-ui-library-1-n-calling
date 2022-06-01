// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, mergeStyles } from "@fluentui/react";

export const imgStyle = mergeStyles({
  width: "16.5rem",
  padding: "0.5rem",
  "@media (max-width: 67.1875rem)": {
    display: "none",
  },
});
export const infoContainerStyle = mergeStyles({
  padding: "0.5rem",
  width: "20rem",
});
export const containerStyle = mergeStyles({
  height: "100%",
  width: "100% ",
});
export const configContainerStyle = mergeStyles({
  minWidth: "10rem",
  width: "auto",
  height: "auto",
});
export const configContainerStackTokens: IStackTokens = {
  childrenGap: "1.25rem",
};
export const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: "1.25rem", // 20px
  lineHeight: "1.75rem", // 28px
  width: "20rem",
  marginBottom: "1.5rem",
});
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: "0.875rem", // 14px
  width: "100%",
  height: "2.5rem",
  borderRadius: 3,
  padding: "0.625rem",
});
