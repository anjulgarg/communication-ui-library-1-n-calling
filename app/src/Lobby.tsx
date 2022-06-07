import { Call, CallAgent } from "@azure/communication-calling";
import {
  CallClientState,
  StatefulCallClient,
} from "@azure/communication-react";
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
  callClient: StatefulCallClient;
  receiverId: { communicationUserId: string } | { id: string };
  onConnected: (call: Call) => void;
  onDisconnected: () => void;
}

const DEFAULT_CALL_STATE = "Please wait while we connect you...";

export const Lobby = (props: LobbyProps): JSX.Element => {
  const { callClient, callAgent, receiverId, onConnected, onDisconnected } =
    props;
  const [call, setCall] = useState<Call>();
  const [callState, setCallState] = useState<CallClientState>(
    callClient.getState
  );

  const callStatus = call ? callState.calls[call.id].state : DEFAULT_CALL_STATE;

  useEffect(() => {
    const stateChangeListener = (state: CallClientState) => {
      setCallState(state);
    };
    callClient.onStateChange(stateChangeListener);
    return () => {
      callClient.offStateChange(stateChangeListener);
    };
    // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCall = useCallback(() => {
    const call = callAgent.startCall([receiverId], {});
    setCall(call);
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

  /**
   * Run props.onConnected when call is connected
   */
  useEffect(() => {
    if (call && callStatus === "Connected") {
      return onConnected(call);
    }

    if (call && callStatus === "Disconnected") {
      return setCall(undefined);
    }
  }, [callStatus, call, onConnected]);

  return (
    <CenteredContent>
      {callStatus !== "Disconnected" ? (
        <Spinner label={callStatus} labelPosition="top" />
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
