import { Call, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import {
  createStatefulCallClient,
  DEFAULT_COMPONENT_ICONS,
  StatefulCallClient,
} from "@azure/communication-react";
import { PrimaryButton, registerIcons, Spinner, Stack } from "@fluentui/react";
import { useEffect, useState } from "react";
import { CallScreen } from "./CallScreen";
import { CenteredContent } from "./Components/CenteredContent";
import { HomeScreen } from "./HomeScreen";
import { Lobby } from "./Lobby";

type AppPages = "home" | "initClient" | "config" | "lobby" | "call";

registerIcons({
  icons: {
    ...DEFAULT_COMPONENT_ICONS,
  },
});

function App(): JSX.Element {
  const [page, setPage] = useState<AppPages>("home");
  const userToken =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNCIsIng1dCI6IlJDM0NPdTV6UENIWlVKaVBlclM0SUl4Szh3ZyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmRkOTc1M2MwLTZlNjItNGY3NC1hYjBmLWM5NGY5NzIzYjRlYl8wMDAwMDAxMS1jMTA2LTU1YWMtNTcwYy0xMTNhMGQwMDdmYjAiLCJzY3AiOjE3OTIsImNzaSI6IjE2NTQxMTg0NjEiLCJleHAiOjE2NTQyMDQ4NjEsImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiJkZDk3NTNjMC02ZTYyLTRmNzQtYWIwZi1jOTRmOTcyM2I0ZWIiLCJpYXQiOjE2NTQxMTg0NjF9.j6bTEArKr6opQIh_cr3EoXSnPB87UJCEaQ7Dx-4___zxCOAdXPQn7eV-OQGYn-CNVUFAnfo-9_aqR8ZEiDcCrW88AnKAr8tirpU4HBg9m7d6CTbgK2_ykvLL-s15CV-bTUryP-e2CVf5Q0b-u19kVbgiOcgLtiMXBNbl_0CaKRPrcpMIewQDpifiLZwT3d7mzrk-SVksyE-F3iL7PyUdLpf88vLFZ_kmP2gfsRIgo27Kg5B6E9_7tgD3e399DkGj15XY9klSYngn9v3VhFvLux-aOUoBbM-Hns9LOoU0B_ro0xy8dQpWUudDDljJtHUv0n3OT-DY5XUM__j5Fvce9A";
  const userId =
    "8:acs:dd9753c0-6e62-4f74-ab0f-c94f9723b4eb_00000011-c106-55ac-570c-113a0d007fb0";
  const [displayName, setDisplayName] = useState<string>();
  const [receiverId, setReceiverId] = useState<
    { communicationUserId: string } | { id: string }
  >();

  const [statefulCallClient, setStatefulCallClient] =
    useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();

  /**
   * Initialize the stateful call client
   */
  useEffect(() => {
    console.log("Creating stateful call client");
    setStatefulCallClient(
      createStatefulCallClient({
        userId: { communicationUserId: userId },
      })
    );
  }, [userId]);

  /**
   * Initialize the call agent
   */
  useEffect(() => {
    if (callAgent === undefined && statefulCallClient && displayName) {
      const tokenCredential = new AzureCommunicationTokenCredential(userToken);
      const createCallAgent = async () => {
        console.log("Creating call agent");
        setCallAgent(
          await statefulCallClient.createCallAgent(tokenCredential, {
            displayName,
          })
        );
      };
      createCallAgent();
    }
    return () => {
      callAgent && callAgent.dispose();
    };
  }, [callAgent, displayName, statefulCallClient]);

  switch (page) {
    case "home": {
      document.title = "ACS UI Library 1:N Calling POC";
      return (
        <HomeScreen
          startCallHandler={(callDetails) => {
            setDisplayName(callDetails.displayName);
            setReceiverId(callDetails.receiverId);
            setPage("initClient");
          }}
        />
      );
    }
    case "initClient": {
      if (!statefulCallClient || !callAgent) {
        return (
          <CenteredContent>
            <Spinner label={"Creating Call Agent"} labelPosition="top" />
          </CenteredContent>
        );
      } else {
        setPage("lobby");
        return <></>;
      }
    }
    case "lobby": {
      if (callAgent && receiverId) {
        return (
          <Lobby
            callAgent={callAgent}
            receiverId={receiverId}
            onConnected={(call) => {
              setCall(call);
              setPage("call");
            }}
          />
        );
      } else {
        return <></>;
      }
    }
    case "call": {
      document.title = "ACS UI Library 1:N Call";
      if (statefulCallClient && callAgent && receiverId && call) {
        return (
          <CallScreen
            callClient={statefulCallClient}
            callAgent={callAgent}
            receiverId={receiverId}
            call={call}
          />
        );
      } else {
        return (
          <Stack>
            <Stack>
              There was a Problem with your credentials please try again
            </Stack>
            <PrimaryButton
              text="Return to home page"
              onClick={() => {
                setPage("home");
              }}
            ></PrimaryButton>
          </Stack>
        );
      }
    }
    default: {
      document.title = "Invalid Page";
      return <>Invalid Page</>;
    }
  }
}

export default App;
