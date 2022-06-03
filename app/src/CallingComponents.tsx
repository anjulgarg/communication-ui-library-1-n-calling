import { Call, RemoteParticipant } from "@azure/communication-calling";
import { ControlBarButton } from "@azure/communication-react";
import {
  Checkbox,
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  Spinner,
} from "@fluentui/react";
import { PersonAdd20Filled } from "@fluentui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { CenteredContent } from "./Components/CenteredContent";
import { InputField } from "./InputField";

export const AddParticipantButton = (props: {
  addParticipant: Call["addParticipant"];
}): JSX.Element => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <AddParticipantDialog
        isOpen={isDialogOpen}
        onDismiss={() => setIsDialogOpen(false)}
        addParticipant={props.addParticipant}
      />
      <ControlBarButton
        onClick={() => {
          setIsDialogOpen(true);
        }}
        onRenderIcon={() => <PersonAdd20Filled />}
        strings={{
          label: "Add participant",
          tooltipContent: "Add participant",
        }}
      />
    </>
  );
};

export const AddParticipantDialog = (props: {
  isOpen: boolean;
  onDismiss: () => void;
  addParticipant: Call["addParticipant"];
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [isTeamsUser, setIsTeamsUser] = useState(false);
  const [participantId, setParticipantId] = useState<string>();
  const [remoteParticipant, setRemoteParticipant] =
    useState<RemoteParticipant>();

  const [callState, setCallState] = useState<string>(
    "Adding participant. Please wait..."
  );

  /** Watch Props for isOpen */
  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props]);

  /** Subscribe to remoteParticipant call state event */
  useEffect(() => {
    if (!remoteParticipant) return;
    const stateChangedListener = () => {
      setCallState(remoteParticipant.state);
    };
    remoteParticipant.on("stateChanged", stateChangedListener);
    return () => {
      remoteParticipant.off("stateChanged", stateChangedListener);
    };
  }, [remoteParticipant]);

  const onDismiss = useCallback(() => {
    setIsOpen(false);
    props.onDismiss();
  }, [props]);

  /** Clear remote participant if the call state is disconnected */
  useEffect(() => {
    if (callState === "Disconnected") {
      setRemoteParticipant(undefined);
    } else if (callState === "Connected") {
      setRemoteParticipant(undefined);
      onDismiss();
    }
  }, [callState, onDismiss]);

  const addParticipant = async () => {
    if (!participantId) return;
    let userId;
    if (isTeamsUser) {
      userId = { microsoftTeamsUserId: participantId };
    } else {
      userId = { communicationUserId: participantId };
    }
    setRemoteParticipant(await props.addParticipant(userId));
  };

  return (
    <>
      <Dialog
        hidden={!isOpen}
        onDismiss={onDismiss}
        dialogContentProps={{ title: "Add Participant" }}
        modalProps={{ isBlocking: true }}
      >
        {remoteParticipant ? (
          <CenteredContent>
            <br />
            <Spinner label={callState} labelPosition="bottom" />
          </CenteredContent>
        ) : (
          <>
            <InputField
              setValue={setParticipantId}
              label={`${isTeamsUser ? "Teams" : "Communication"} User ID`}
            />
            <div style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
              <Checkbox
                label="Is Teams User"
                onChange={(ev, checked) => setIsTeamsUser(!!checked)}
              />
            </div>
            <DialogFooter>
              <PrimaryButton
                text="Add"
                disabled={!participantId}
                onClick={() => {
                  addParticipant();
                }}
              />
              <DefaultButton onClick={onDismiss} text="Cancel" />
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
};

const ParticipantCallProgress = (props: {
  participant: RemoteParticipant;
}): JSX.Element => {
  const { participant } = props;
  const [callState, setCallState] = useState<string>(
    "Adding participant. Please wait..."
  );

  useEffect(() => {
    participant.on("stateChanged", () => {
      setCallState(participant.state);
    });
  }, [participant]);

  return (
    <CenteredContent>
      <br />
      <Spinner label={callState} labelPosition="bottom" />
    </CenteredContent>
  );
};
