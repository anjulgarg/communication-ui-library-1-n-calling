import { Call, CallAgent } from "@azure/communication-calling";
import { Spinner } from "@fluentui/react";
import { useEffect, useState } from "react";
import { CenteredContent } from "./Components/CenteredContent";

export interface LobbyProps {
  callAgent: CallAgent;
  receiverId: { communicationUserId: string } | { id: string };
  onConnected: (call: Call) => void;
}

export const Lobby = (props: LobbyProps): JSX.Element => {
  const { callAgent, receiverId, onConnected } = props;
  const [call, setCall] = useState<Call>();
  const [callState, setCallState] = useState<string>(
    "Please wait while we connect you..."
  );

  /**
   * Start a call
   */
  useEffect(() => {
    if (callAgent) {
      const call = callAgent.startCall([receiverId], {});
      setCall(call);
      console.log(`CallId ${call?.id}`);
    }
  }, [callAgent, receiverId]);

  /**
   * Sub/Unsub to Call Events
   */
  useEffect(() => {
    if (!call) {
      return;
    }
    call.on("stateChanged", () => {
      setCallState(call.state);
    });

    return () => {
      call.off("stateChanged", () => {
        setCallState(call.state);
      });
    };
  }, [call, onConnected]);

  /**
   * Run props.onConnected when call is connected
   */
  useEffect(() => {
    if (callState === "Connected" && call) {
      onConnected(call);
    }
  }, [callState, call, onConnected]);

  return (
    <CenteredContent>
      <Spinner label={callState} labelPosition="top" />
    </CenteredContent>
  );
};
