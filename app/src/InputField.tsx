// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TextField } from "@fluentui/react";
import React, { useState } from "react";
import {
  inputBoxStyle,
  inputBoxTextStyle,
  TextFieldStyleProps,
} from "./styles/InputField.styles";

interface InputFieldProps {
  setValue?: (value: string) => void;
  setEmptyWarning?(isEmpty: boolean): void;
  isEmpty?: boolean;
  defaultValue?: string;
  label?: string;
  palceholder?: string;
  emptyErrorMessage?: string;
  maxCharsErrorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

const DISPLAY_NAME_MAX_CHARS = 256;
const hasValidLength = (name: string) => name.length <= DISPLAY_NAME_MAX_CHARS;

export const InputField = (props: InputFieldProps): JSX.Element => {
  const {
    setValue,
    setEmptyWarning,
    isEmpty,
    defaultValue,
    label,
    emptyErrorMessage,
    maxCharsErrorMessage,
    palceholder,
    required = true,
    disabled = false,
  } = props;
  const [isInvalidLength, setIsInvalidLength] = useState<boolean>(
    !hasValidLength(defaultValue ?? "")
  );

  const onNameTextChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (newValue === undefined) {
      return;
    }

    if (!hasValidLength(newValue)) {
      setIsInvalidLength(true);
      setValue && setValue("");
      return;
    } else {
      setIsInvalidLength(false);
    }

    setValue && setValue(newValue);
    if (setEmptyWarning && !newValue) {
      setEmptyWarning(true);
    } else {
      setEmptyWarning && setEmptyWarning(false);
    }
  };

  return (
    <TextField
      disabled={disabled}
      autoComplete="off"
      defaultValue={defaultValue}
      inputClassName={inputBoxTextStyle}
      label={label}
      required={required}
      className={inputBoxStyle}
      onChange={onNameTextChange}
      placeholder={palceholder}
      styles={TextFieldStyleProps}
      errorMessage={
        isEmpty
          ? emptyErrorMessage
          : isInvalidLength
          ? maxCharsErrorMessage
          : undefined
      }
    />
  );
};
