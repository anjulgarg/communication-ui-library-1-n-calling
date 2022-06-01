import {
  CommunicationUserIdentifier,
  PhoneNumberIdentifier,
  MicrosoftTeamsUserIdentifier,
  UnknownIdentifier,
} from "@azure/communication-common";
import {
  usePropsFor,
  VideoGallery,
  ControlBar,
  // HoldButton,
  CameraButton,
  MicrophoneButton,
  ScreenShareButton,
  EndCallButton,
  useCallClient,
  CallClientState,
  RemoteParticipantState,
  GridLayout,
  ParticipantList,
} from "@azure/communication-react";
import { Stack } from "@fluentui/react";
import { useCallback, useState } from "react";
import { AddParticipantField } from "./Components/AddParticipantField";
import { RemoveParticipantTile } from "./Components/RemoveParticipantTile";

export type CallingComponentsProps = {
  onToggleHold: () => Promise<void>;
  onAddParticipant: (participant: string, caller: string) => Promise<void>;
  onRemoveParticipant: (
    participant:
      | PhoneNumberIdentifier
      | CommunicationUserIdentifier
      | MicrosoftTeamsUserIdentifier
      | UnknownIdentifier
  ) => Promise<void>;
  caller: string;
  callId: string;
};

function CallingComponents(props: CallingComponentsProps): JSX.Element {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);
  const participantListProps = usePropsFor(ParticipantList);
  // const holdButtonProps = usePropsFor(HoldButton);

  const callClient = useCallClient();

  const [callEnded, setCallEnded] = useState(false);
  const [callState, setCallState] = useState<CallClientState>(
    callClient.getState
  );

  callClient.onStateChange((state: CallClientState) => {
    if (state.callsEnded[props.callId]) {
      setCallEnded(true);
      return;
    }
    setCallState(state);
  });

  console.log(callClient.getState().calls[props.callId].state);

  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps]);

  if (callEnded) {
    return <CallEnded />;
  }

  if (callState.calls[props.callId].state === "Connecting") {
    return <h1>Performing setup</h1>;
  }

  if (callState.calls[props.callId].state === "Ringing") {
    return (
      <Stack>
        <CallRinging />
        <ControlBar layout="floatingBottom">
          {endCallProps && (
            <EndCallButton {...endCallProps} onHangUp={onHangup} />
          )}
        </ControlBar>
      </Stack>
    );
  }

  // Array of participant tiles that are used to remove a participant and display their call state
  let removeParticipantTiles: JSX.Element[] = [];

  /**
   * Using the video gallery participants we can map to the remote participants in the client
   *
   * This highlights something thats missing with the VideoGalleryParticipant type that the other pieces of the remote participant object
   * are missing. To fix this we should edit the type and selector to include the missing information like type, this is useful
   * because if we make this happen we can leverage the VideoGallery's onRenderRemoteTile prop to inject a custom PSTN video tile into
   * the Video gallery for PSTN calls.
   * - this would allow Contoso to have their own cutom PSTN operations in the tile as well.
   */
  videoGalleryProps.remoteParticipants.forEach((p) => {
    let participant: RemoteParticipantState;
    participant = callState.calls[props.callId].remoteParticipants[p.userId];
    removeParticipantTiles.push(
      <RemoveParticipantTile
        remoteParticipant={participant}
        onRemoveParticipant={props.onRemoveParticipant}
      />
    );
  });

  console.log(callClient.getState().calls[props.callId].state);
  participantListProps.participants.forEach((p) => {
    p.displayName = p.userId;
  });

  return (
    <Stack>
      <Stack>
        <Stack
          style={{
            width: "12rem",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "3rem",
          }}
        >
          <AddParticipantField
            onAddParticipant={props.onAddParticipant}
            caller={props.caller}
          ></AddParticipantField>
        </Stack>
        <div>
          <Stack style={{ width: "auto", height: "60rem" }}>
            {videoGalleryProps &&
              callState.calls[props.callId].state === "Connected" && (
                <VideoGallery {...videoGalleryProps} />
              )}
            {callState.calls[props.callId].state ===
              ("LocalHold" || "RemoteHold") && <CallHold />}
            <ControlBar layout="floatingBottom">
              {cameraProps && <CameraButton {...cameraProps} />}
              {microphoneProps && <MicrophoneButton {...microphoneProps} />}
              {screenShareProps && <ScreenShareButton {...screenShareProps} />}
              {/* {holdButtonProps && <HoldButton {...holdButtonProps} />} */}
              {endCallProps && (
                <EndCallButton {...endCallProps} onHangUp={onHangup} />
              )}
            </ControlBar>
            <ParticipantList {...participantListProps} />
            <GridLayout styles={{ root: { padding: "3rem" } }}>
              {removeParticipantTiles}
            </GridLayout>
          </Stack>
        </div>
      </Stack>
    </Stack>
  );
}

function CallEnded(): JSX.Element {
  return <h1>The call has ended.</h1>;
}

function CallHold(): JSX.Element {
  return <h1>The Call is on hold.</h1>;
}

function CallRinging(): JSX.Element {
  return <h1>Ringing</h1>;
}

export default CallingComponents;
