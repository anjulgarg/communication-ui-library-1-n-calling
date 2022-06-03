import { Call, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  createStatefulCallClient,
  DEFAULT_COMPONENT_ICONS,
  StatefulCallClient,
  FluentThemeProvider,
} from "@azure/communication-react";
import {
  PrimaryButton,
  registerIcons,
  Spinner,
  Stack,
  initializeIcons,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { CallScreen } from "./CallScreen";
import { CenteredContent } from "./Components/CenteredContent";
import { HomeScreen } from "./HomeScreen";
import { Lobby } from "./Lobby";
import { fetchTokenResponse } from "./utils/AppUtils";

type AppPages = "home" | "initClient" | "config" | "lobby" | "call";

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  const [page, setPage] = useState<AppPages>("home");
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>();
  const [receiverId, setReceiverId] = useState<
    { communicationUserId: string } | { id: string }
  >();

  const [statefulCallClient, setStatefulCallClient] =
    useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();

  // Get Azure Communications Service token from the server
  useEffect(() => {
    (async () => {
      try {
        const { token, user } = await fetchTokenResponse();
        setToken(token);
        setUserId(user);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /** If call state is disconnected, return to home page.  */
  useEffect(() => {
    if (!call) return;
    const callStateListener = () => {
      if (call.state === "Disconnected") {
        setCall(undefined);
        setPage("home");
      }
    };
    call.on("stateChanged", callStateListener);
    return () => {
      call.off("stateChanged", callStateListener);
    };
  }, [call]);

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
      const tokenCredential = new AzureCommunicationTokenCredential(token);
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
  }, [callAgent, displayName, statefulCallClient, token]);

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
          <FluentThemeProvider>
            <CallClientProvider callClient={statefulCallClient}>
              <CallAgentProvider callAgent={callAgent}>
                <CallProvider call={call}>
                  <CallScreen
                    callClient={statefulCallClient}
                    callAgent={callAgent}
                    receiverId={receiverId}
                    call={call}
                  />
                </CallProvider>
              </CallAgentProvider>
            </CallClientProvider>
          </FluentThemeProvider>
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
