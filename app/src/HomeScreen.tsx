// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallAgent,
  IncomingCall,
  IncomingCallEvent,
} from "@azure/communication-calling";
import { CommunicationUserIdentifier } from "@azure/communication-common";
import { CallClientState } from "@azure/communication-react";
import { Image, PrimaryButton, Stack, Text, TextField } from "@fluentui/react";
import { useEffect, useRef, useState } from "react";
import heroSVG from "./assets/hero.svg";
import { IncomingCallToast } from "./IncomingCallAlert";
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
  callState: CallClientState;
  callAgent: CallAgent;
  userId?: CommunicationUserIdentifier;
  startCallHandler(callDetails: {
    receiverId: { communicationUserId: string } | { id: string };
  }): void;
  onAcceptIncomingCall(call: Call): void;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const {
    callState,
    callAgent,
    userId,
    startCallHandler,
    onAcceptIncomingCall,
  } = props;
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = "Call an Azure Communication User";
  const buttonText = "Next";

  const [receiverId, setReceiverId] = useState<string | undefined>(undefined);
  const [incomingCall, setIncomingCall] = useState<IncomingCall>();
  const interval = useRef<NodeJS.Timer>();

  // @TODO: Add a method in declarative callAgent to get a declarative Incoming Call Object. Use that object here.
  console.log("incoming calls", callState.incomingCalls);

  /**
   * Subscribe to incoming call events.
   */
  useEffect(() => {
    const incomingCallListener: IncomingCallEvent = ({ incomingCall }) => {
      setIncomingCall(incomingCall);
    };
    callAgent.on("incomingCall", incomingCallListener);
    return () => {
      callAgent.off("incomingCall", incomingCallListener);
    };
  }, [callAgent]);

  /**
   * Incoming Call Ringtone
   */
  useEffect(() => {
    if (incomingCall) {
      const audio = new Audio(
        "https://cdn.freesound.org/previews/29/29621_98464-lq.mp3"
      );
      interval.current = setInterval(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }, 3000);
    } else {
      clearInterval(interval.current);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [incomingCall]);

  /**
   * Start call handler
   */
  const onStartCall = (): void => {
    const receiverCommunicationId = receiverId
      ? { communicationUserId: receiverId }
      : { id: "8:echo123" };

    startCallHandler({
      receiverId: receiverCommunicationId,
    });
  };

  const onRejectCall = (): void => {
    if (incomingCall) {
      incomingCall.reject();
    }
    setIncomingCall(undefined);
  };

  const onAcceptCall = async (): Promise<void> => {
    if (incomingCall) {
      const call = await incomingCall.accept();
      onAcceptIncomingCall(call);
    }
    setIncomingCall(undefined);
  };

  return (
    <>
      {incomingCall && (
        <Stack style={{ position: "absolute", bottom: "2rem", right: "2rem" }}>
          <IncomingCallToast
            callerName={incomingCall.callerInfo.displayName}
            onClickAccept={onAcceptCall}
            onClickReject={onRejectCall}
          />
        </Stack>
      )}
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
            <TextField
              readOnly
              contentEditable={false}
              label="Your User ID"
              value={userId?.communicationUserId}
            />

            <InputField
              required={false}
              defaultValue="8:echo123"
              setValue={setReceiverId}
              label="Receiver's User ID"
              palceholder="Default 8:echo123"
            />

            <PrimaryButton
              className={buttonStyle}
              text={buttonText}
              onClick={onStartCall}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
