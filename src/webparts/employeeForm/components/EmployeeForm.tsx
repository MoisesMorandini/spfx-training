import { DefaultButton, PrimaryButton } from '@microsoft/office-ui-fabric-react-bundle';
import { IStackTokens, Stack } from 'office-ui-fabric-react/lib/Stack';
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import styles from './EmployeeForm.module.scss';
import { IEmployeeFormProps } from './IEmployeeFormProps';

import { sp } from "@pnp/sp/presets/all";

interface EmployeeForm {
  firstName: string;
  lastName: string;
  birthdayDate: string;
}

export default function EmployeeForm({ spcontext }: IEmployeeFormProps) {
  const { useState, useEffect } = React;
  const [error, setError] = useState(false);
  const [employeeForm, setEmployeeForm] = useState<EmployeeForm>({
    firstName: '',
    lastName: '',
    birthdayDate: ''
  });

  useEffect(() => {
    sp.setup({
      spfxContext: spcontext
    })
  }, [])

  useEffect(() => {
    console.log(`load -> load 0.12`)
    async function load() {
      const listItems = await sp.web.lists.getById('35b3ddaa-29af-4a00-87f4-b87877037c43').items.get();
      console.log(`load -> listItems`, listItems)
    }
    load();
  }, [])

  const onInputChange: any = ((event, newValue) => {
    setEmployeeForm(prevForm => ({
      ...prevForm,
      [event.target.name]: newValue
    }));
  })

  const handleSubmit = () => {
    console.log('submit');

  }

  const handleCancel = () => {
    setEmployeeForm({
      firstName: '',
      lastName: '',
      birthdayDate: ''
    })
  }

  const stackTokens: IStackTokens = { childrenGap: 40, padding: 10 }
  return (
    <div className={styles.employeeForm}>
      <form>
        <Stack>
          <TextField label="First Name" required errorMessage={error && "Please, add a first name"}
            name='firstName'
            value={employeeForm.firstName}
            onChange={onInputChange}
          />
          <TextField label="Last Name" required errorMessage={error && "Please, add a last name"}
            name='lastName'
            value={employeeForm.lastName}
            onChange={onInputChange} />
          <MaskedTextField label="Birthday Date" required errorMessage={error && "Please, add a birthday date"}
            name='birthdayDate'
            mask='99/99/9999'
            value={employeeForm.birthdayDate}
            onChange={onInputChange} />
        </Stack>
      </form>

      <Stack horizontal tokens={stackTokens}>
        <DefaultButton text="Cancelar" onClick={handleCancel} allowDisabledFocus />
        <PrimaryButton text="Adicionar" onClick={handleSubmit} allowDisabledFocus />
      </Stack>
    </div>
  );
}
