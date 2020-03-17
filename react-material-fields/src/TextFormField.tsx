import TextField from "@material-ui/core/TextField";
import { TextFieldProps } from "@material-ui/core/TextField/TextField";
import React, { useCallback, useState } from "react";
import { useForm } from "react-forms-base";

export type TextFormFieldProps = TextFieldProps & {
  /**
   * It should return error message on error, and falsy value like empty string if it does not have any error.
   *
   * @param value Value of the text field.
   */
  validate: (value: string) => string | void;
};

/**
 *
 * @param props
 */
export const TextFormField: React.FC<TextFormFieldProps> = (
  props: TextFormFieldProps
) => {
  const [error, setError] = useState("");
  const reg = useForm();

  const register = useCallback(
    (node: HTMLInputElement) => {
      reg.register(() => {
        console.log(node.value);
        const e = props.validate(node.value);
        if (typeof e === "string") {
          setError(e);
        } else {
          // Clear error
          setError("");
        }
        return !e;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <TextField
      {...{
        ...props,
        validate: undefined,
        error: !!error,
        helperText: !!error ? error : props.helperText
      }}
      inputRef={register}
    />
  );
};
