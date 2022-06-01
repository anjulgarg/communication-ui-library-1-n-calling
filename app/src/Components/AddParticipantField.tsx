import { TextField, IconButton, Stack } from '@fluentui/react'
import { useState } from "react";
import { AddPhoneIcon } from '@fluentui/react-icons-mdl2';

export type AddParticipantFieldProps = {
    onAddParticipant: (participant: string, caller: string) => Promise<void>;
    caller: string;
}

export const AddParticipantField = (props: AddParticipantFieldProps): JSX.Element => {
    const { onAddParticipant, caller } = props;
    const [participant, setParticipant] = useState<string | undefined>(undefined);

    const setText = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string | undefined
    ): void => {
        if (newValue === undefined) {
            return;
        }
        setParticipant(newValue);
    };

    return (
        <Stack horizontal disableShrink>
            <TextField onChange={setText}>
            </TextField><IconButton onRenderIcon={() => <AddPhoneIcon />} onClick={() => {
                if (participant && caller) {
                    onAddParticipant(participant, caller);
                }
            }}></IconButton>
        </Stack>);
}
/**
 * Thoughts around group calling
 * 
 * When making a group call and dialing out to a new PSTN user if it goes to voicemail each user in the call leaves
 * a individual voice mail. In this situation should we remove the user when their end goes to voicemail? is there a way to tell from
 * Calling-SDK that we have gone to a voicemail machine?
 * 
 */