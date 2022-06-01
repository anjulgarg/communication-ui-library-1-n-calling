import { ControlBar, EndCallButton, toFlatCommunicationIdentifier, RemoteParticipantState } from "@azure/communication-react";
import { CommunicationUserIdentifier, PhoneNumberIdentifier, MicrosoftTeamsUserIdentifier, UnknownIdentifier } from '@azure/communication-common';
import {Stack} from '@fluentui/react'

export type RemoveParticipantTileProps = {
    remoteParticipant: RemoteParticipantState;
    onRemoveParticipant: (participant: PhoneNumberIdentifier | CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier
        | UnknownIdentifier) => Promise<void>;
}

/**
 * tile for removing PSTN users 
 * 
 * This should be repurposed into a custom video tile for the video gallery
 */
export const RemoveParticipantTile = (props: RemoveParticipantTileProps): JSX.Element => {
    const {remoteParticipant} = props;
    return (
      <Stack>
        <h2>{remoteParticipant.state}</h2>
        <h2>{toFlatCommunicationIdentifier(remoteParticipant.identifier)}</h2>
        <ControlBar>
          <EndCallButton onHangUp={() => props.onRemoveParticipant(remoteParticipant.identifier)}></EndCallButton>
        </ControlBar>
      </Stack>
    )
  };