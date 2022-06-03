// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupLocator } from "@azure/communication-calling";

/**
 * Get ACS user token from the Contoso server.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokenResponse = async (): Promise<any> => {
  const response = await fetch("http://localhost:8080/token?scope=voip");
  if (response.ok) {
    const responseAsJson = await response.json(); //(await response.json())?.value?.token;
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw new Error("Invalid token response");
};

/**
 * Generate a random user name.
 * @return username in the format user####
 */
export const createRandomDisplayName = (): string =>
  "user" + Math.ceil(Math.random() * 1000);

/**
 * Get group id from the url's query params.
 */
export const getGroupIdFromUrl = (): GroupLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const gid = urlParams.get("groupId");
  return gid ? { groupId: gid } : undefined;
};
