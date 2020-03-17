import React, { createContext, useContext, useState } from "react";

/**
 * Place to store validators.
 */
export interface Registry {
  register(validator: Validator): void;
}

const def: Registry = {
  register(validator: Validator): void {
    throw new Error(
      "Validator registry is accessible only from children of `Form`"
    );
  }
};
const FormContext = createContext(def);

/**
 * Validator should return true if value is valid.
 */
export interface Validator {
  (): boolean;
}

interface Props {
  /**
   * Children node. It can be FormField (e.g. TextFormField from `react-material-fields`)
   */
  children?: React.ReactNode;
  /**
   * Called when form is fully validated and there was no error.
   */
  onSuccess?: () => any;
  /**
   * Called when form had one or more errors.
   */
  onError?: () => any;
}

export const Form: React.FC<Props> = (props: Props) => {
  const [validators, setValidators] = useState<Validator[]>([]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    let hasError = false;
    validators.forEach(v => {
      const valid = v();
      if (!valid) {
        hasError = true;
      }
    });

    if (hasError) {
      props?.onError?.();
      return;
    }
    props?.onSuccess?.();
  }

  return (
    <form onSubmit={submit}>
      <FormContext.Provider
        value={{
          register(validator: Validator): void {
            setValidators(vs => [validator, ...vs]);
          }
        }}
      >
        {props.children}
      </FormContext.Provider>
    </form>
  );
};

export function useForm(): Registry {
  return useContext(FormContext);
}
