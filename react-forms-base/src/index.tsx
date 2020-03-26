import React, { createContext, useContext, useState } from "react";

/**
 * Place to store validators.
 */
export interface Registry {
  register(validator: Validator): Unregister;
}

const def: Registry = {
  register(validator: Validator): Unregister {
    if (console) {
      console.error(
        "Validator registry is accessible only from children of `Form`"
      );
    }

    return () => {};
  }
};
const FormContext = createContext(def);

/**
 * Validator should return true if value is valid.
 */
export interface Validator {
  (): boolean;
}

export interface Unregister {
  (): any;
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
          register(validator: Validator): Unregister {
            setValidators(vs => [validator, ...vs]);

            return () => {
              setValidators(vs => vs.filter(v => v !== validator));
            };
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
