// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Image, PrimaryButton, Stack, Text } from "@fluentui/react";
import { useState } from "react";
import heroSVG from "./assets/hero.svg";
import { InputField } from "./InputField";
import {
  buttonStyle,
  configContainerStackTokens,
  configContainerStyle,
  containerStyle,
  headerStyle,
  imgStyle,
  infoContainerStyle,
} from "./styles/HomeScreen.styles";

export interface HomeScreenProps {
  startCallHandler(callDetails: {
    displayName: string;
    receiverId?: { communicationUserId: string } | { id: string };
  }): void;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = "Call an Azure Communication User";
  const buttonText = "Next";

  const [receiverId, setReceiverId] = useState<string | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const buttonEnabled = displayName;

  const onStartCall = (): void => {
    if (!displayName) {
      return;
    }

    const receiverCommunicationId = receiverId
      ? { communicationUserId: receiverId }
      : { id: "8:echo123" };

    props.startCallHandler({
      displayName,
      receiverId: receiverCommunicationId,
    });
  };

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      className={containerStyle}
    >
      <Image
        alt="Welcome to the ACS 1:N Calling sample app"
        className={imgStyle}
        {...imageProps}
      />
      <Stack className={infoContainerStyle}>
        <Text role={"heading"} aria-level={1} className={headerStyle}>
          {headerTitle}
        </Text>
        <Stack
          className={configContainerStyle}
          tokens={configContainerStackTokens}
        >
          <InputField
            defaultValue={displayName}
            setValue={setDisplayName}
            label="Caller's Display Name"
            palceholder="Enter a name"
          />

          <InputField
            required={false}
            defaultValue="8:echo123"
            setValue={setReceiverId}
            label="Receiver's User ID"
            palceholder="Default 8:echo123"
          />

          <PrimaryButton
            disabled={!buttonEnabled}
            className={buttonStyle}
            text={buttonText}
            onClick={onStartCall}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
