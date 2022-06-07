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

export interface WelcomeScreenProps {
  onSubmit: (displayName: string) => void;
}

export const WelcomeScreen = (props: WelcomeScreenProps): JSX.Element => {
  const { onSubmit } = props;
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = "Call an Azure Communication User";
  const buttonText = "Next";

  const [displayName, setDisplayName] = useState<string | undefined>(undefined);

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
            label="Your Display Name"
            palceholder="Enter a name"
          />

          <PrimaryButton
            disabled={!displayName}
            className={buttonStyle}
            text={buttonText}
            onClick={() => onSubmit(displayName!)}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
