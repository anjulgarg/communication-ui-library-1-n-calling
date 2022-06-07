import { Call } from "@azure/communication-calling";
import {
  ControlBarButton,
  getCallingSelector,
  ParticipantList,
  useSelector,
} from "@azure/communication-react";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  Spinner,
} from "@fluentui/react";
import { PersonAdd20Filled } from "@fluentui/react-icons";
import { useEffect, useMemo, useState } from "react";
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
          console.log("Add Participant Button Clicked");
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
  const { onDismiss, isOpen } = props;
  const [participantId, setParticipantId] = useState<string>();

  const { participants } = useSelector(getCallingSelector(ParticipantList));

  const remoteParticipantData = useMemo(() => {
    return participants.find((p) => p.userId === participantId);
  }, [participantId, participants]);

  const callState = remoteParticipantData?.state;

  /** Clear remote participant if the call state is disconnected */
  useEffect(() => {
    if (callState === "Disconnected" || callState === "Connected") {
      onDismiss();
    }
  }, [callState, onDismiss]);

  const addParticipant = async () => {
    if (!participantId) return;
    await props.addParticipant({ communicationUserId: participantId });
  };

  return (
    <>
      <Dialog
        hidden={!isOpen}
        onDismiss={onDismiss}
        dialogContentProps={{ title: "Add Participant" }}
        modalProps={{ isBlocking: true }}
      >
        {remoteParticipantData ? (
          <CenteredContent>
            <br />
            <Spinner label={callState} labelPosition="bottom" />
          </CenteredContent>
        ) : (
          <>
            <InputField
              setValue={setParticipantId}
              label="Communication User ID"
            />
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
