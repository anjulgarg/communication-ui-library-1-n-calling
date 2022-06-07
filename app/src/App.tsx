import { Call, CallAgent } from "@azure/communication-calling";
import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
} from "@azure/communication-common";
import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  createStatefulCallClient,
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  StatefulCallClient,
} from "@azure/communication-react";
import {
  initializeIcons,
  PrimaryButton,
  registerIcons,
  Spinner,
  Stack,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { CallScreen } from "./CallScreen";
import { CenteredContent } from "./Components/CenteredContent";
import { HomeScreen } from "./HomeScreen";
import { Lobby } from "./Lobby";
import { fetchTokenResponse } from "./utils/AppUtils";
import { WelcomeScreen } from "./WelcomeScreen";

type AppPages = "welcome" | "home" | "initClient" | "config" | "lobby" | "call";

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  const [page, setPage] = useState<AppPages>("welcome");
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<CommunicationUserIdentifier>();
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
        console.log("USER ID: ", user);
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
    if (!userId) return;
    console.log("Creating stateful call client");
    setStatefulCallClient(
      createStatefulCallClient({
        userId: userId,
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
    case "welcome": {
      return (
        <WelcomeScreen
          onSubmit={(displayName) => {
            setDisplayName(displayName);
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
        setPage("home");
        return <></>;
      }
    }
    case "home": {
      document.title = "ACS UI Library 1:N Calling POC";
      return callAgent ? (
        <HomeScreen
          callAgent={callAgent}
          userId={userId}
          startCallHandler={(callDetails) => {
            setReceiverId(callDetails.receiverId);
            setPage("lobby");
          }}
          onAcceptIncomingCall={(call: Call) => {
            setCall(call);
            setPage("call");
          }}
        />
      ) : (
        <p>Call Agent Not Available</p>
      );
    }
    case "lobby": {
      if (callAgent && receiverId) {
        return (
          <Lobby
            callAgent={callAgent}
            receiverId={receiverId}
            onDisconnected={() => {
              setCall(undefined);
              setPage("home");
            }}
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
      if (statefulCallClient && callAgent && call) {
        return (
          <FluentThemeProvider>
            <CallClientProvider callClient={statefulCallClient}>
              <CallAgentProvider callAgent={callAgent}>
                <CallProvider call={call}>
                  <CallScreen call={call} />
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
