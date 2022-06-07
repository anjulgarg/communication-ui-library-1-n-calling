import { Call, CallAgent } from "@azure/communication-calling";
import {
  DefaultButton,
  PrimaryButton,
  Spinner,
  Stack,
  Text,
} from "@fluentui/react";
import { useCallback, useEffect, useState } from "react";
import { CenteredContent } from "./Components/CenteredContent";

export interface LobbyProps {
  callAgent: CallAgent;
  receiverId: { communicationUserId: string } | { id: string };
  onConnected: (call: Call) => void;
  onDisconnected: () => void;
}

const DEFAULT_CALL_STATE = "Please wait while we connect you...";

export const Lobby = (props: LobbyProps): JSX.Element => {
  const { callAgent, receiverId, onConnected, onDisconnected } = props;
  const [call, setCall] = useState<Call>();
  const [callState, setCallState] = useState<string>(DEFAULT_CALL_STATE);

  const startCall = useCallback(() => {
    const call = callAgent.startCall([receiverId], {});
    setCall(call);
    setCallState(DEFAULT_CALL_STATE);
    console.log(`CallId ${call?.id}`);
    return call;
  }, [callAgent, receiverId]);

  /**
   * Start a call
   */
  useEffect(() => {
    if (callAgent && !call) {
      startCall();
    }
    // Only call this once per page load for starting a call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callStateListener = useCallback(() => {
    call && setCallState(call.state);
  }, [call]);

  const callSubscriber = useCallback(() => {
    call && call.on("stateChanged", callStateListener);
  }, [call, callStateListener]);

  const callUnsubscriber = useCallback(() => {
    call && call.off("stateChanged", callStateListener);
  }, [call, callStateListener]);

  /**
   * Sub/Unsub to Call Events
   */
  useEffect(() => {
    callSubscriber();
    return () => {
      callUnsubscriber();
    };
  }, [callSubscriber, callUnsubscriber]);

  /**
   * Run props.onConnected when call is connected
   */
  useEffect(() => {
    if (call && callState === "Connected") {
      return onConnected(call);
    }

    if (call && callState === "Disconnected") {
      return setCall(undefined);
    }
  }, [callState, call, onConnected]);

  return (
    <CenteredContent>
      {callState !== "Disconnected" ? (
        <Spinner label={callState} labelPosition="top" />
      ) : (
        <Stack>
          <Text style={{ paddingBottom: "1rem" }}>
            <h2>Disconnected</h2>
            <p>
              User has either declined the call or is unavailable at the moment.{" "}
              <br />
              Please try calling again or return to the Home page.
            </p>
          </Text>
          <Stack horizontal tokens={{ childrenGap: "1rem" }}>
            <PrimaryButton text="Retry Call" onClick={startCall} />
            <DefaultButton text="Return to Home" onClick={onDisconnected} />
          </Stack>
        </Stack>
      )}
    </CenteredContent>
  );
};
