# React form

## Usage

### Simple usage

If you **don't use** forms from `@material-ui/core`, run

```js
npm i -S react-forms-base
```

```ts
// TODO
```

### Material form fields

If you **use** `@material-ui/core`, you can easily add validation logic to a `TextField`.

```js
npm i -S react-forms-base react-material-fields
```

```ts
import { Form } from "react-forms-base";
import { useFormState } from "react-use-form-state";
import { TextFormField } from "react-material-fields/lib/TextFormField";

const MyForm: React.FC = () => {
  // This part is optional. You can your own `onChange` and `value`.
  const [form, { text }] = useFormState<Fields>({});

  return (
    <Form onSuccess={sendToServer}>
      <TextFormField
        {...text("name")}
        label={"Name"}
        validate={v => {
          if (!v) {
            return "Enter name of the app";
          }
        }}
      />

      <TextFormField
        {...text("id")}
        label={"ID"}
        validate={v => {
          if (!v) return "Please enter id of the app";
          if (v.length < 3)
            return "ID of the app should be at least 3 characters";
        }}
      />

      <Button type={"submit"}>Create</Button>
    </Form>
  );
};
```
