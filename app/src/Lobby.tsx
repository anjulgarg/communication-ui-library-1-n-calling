import { Call } from "@azure/communication-calling";
import { CallClientState } from "@azure/communication-react";
import {
  DefaultButton,
  PrimaryButton,
  Spinner,
  Stack,
  Text,
} from "@fluentui/react";
import { useEffect } from "react";
import { CenteredContent } from "./Components/CenteredContent";

export interface LobbyProps {
  call: Call;
  callState: CallClientState;
  receiverId: { communicationUserId: string } | { id: string };
  onConnected: (call: Call) => void;
  onDisconnected: () => void;
}

const DEFAULT_CALL_STATE = "Please wait while we connect you...";

export const Lobby = (props: LobbyProps): JSX.Element => {
  const { callState, call, receiverId, onConnected, onDisconnected } = props;

  const callStatus = call
    ? callState.calls[call.id]?.state
    : DEFAULT_CALL_STATE;

  // @TODO: How do we implement retry mechanism only using stateful client and call agent?

  /**
   * Run props.onConnected when call is connected
   */
  useEffect(() => {
    if (call && callStatus === "Connected") {
      return onConnected(call);
    }
  }, [call, callStatus, onConnected]);

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
            <PrimaryButton text="Retry Call" onClick={() => {}} />
            <DefaultButton text="Return to Home" onClick={onDisconnected} />
          </Stack>
        </Stack>
      )}
    </CenteredContent>
  );
};
