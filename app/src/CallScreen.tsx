import { Call, CallAgent } from "@azure/communication-calling";
import {
  CameraButton,
  ControlBar,
  DevicesButton,
  EndCallButton,
  MicrophoneButton,
  ParticipantsButton,
  StatefulCallClient,
  usePropsFor,
  VideoGallery,
  VideoStreamOptions,
} from "@azure/communication-react";
import { Stack } from "@fluentui/react";
import { AddParticipantButton } from "./CallingComponents";

export interface CallScreenProps {
  callClient: StatefulCallClient;
  callAgent: CallAgent;
  call: Call;
}

const videoStreamOptions: VideoStreamOptions = {
  scalingMode: "Crop",
};

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { callClient, callAgent, call } = props;

  const videoGalleryProps = usePropsFor(VideoGallery);
  const remoteParticipants = videoGalleryProps.remoteParticipants.map((p) => {
    return {
      ...p,
      displayName: p.displayName === "" ? p.userId : p.displayName,
    };
  });

  return (
    <Stack style={{ width: "100%", height: "100%", position: "relative" }}>
      <VideoGallery
        {...videoGalleryProps}
        remoteParticipants={remoteParticipants}
        remoteVideoViewOptions={videoStreamOptions}
        localVideoViewOptions={videoStreamOptions}
      />
      <Stack style={{ position: "absolute", height: "100%", width: "100%" }}>
        <ControlBar layout="floatingBottom">
          <CameraButton {...usePropsFor(CameraButton)} />
          <MicrophoneButton {...usePropsFor(MicrophoneButton)} />
          <DevicesButton {...usePropsFor(DevicesButton)} />
          <AddParticipantButton addParticipant={call.addParticipant} />
          <ParticipantsButton {...usePropsFor(ParticipantsButton)} />
          <EndCallButton {...usePropsFor(EndCallButton)} />
        </ControlBar>
      </Stack>
    </Stack>
  );
};
