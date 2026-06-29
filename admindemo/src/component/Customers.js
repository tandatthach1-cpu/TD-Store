import React from "react";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  List,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";
import ListActions from "./ListActions";

const CustomerForm = () => (
  <SimpleForm defaultValues={{ active: true }}>
    <TextInput source="username" fullWidth />
    <TextInput source="fullName" fullWidth />
    <TextInput source="email" fullWidth />
    <TextInput source="numphone" fullWidth />
    <TextInput source="pass" type="password" fullWidth />
    <BooleanInput source="active" />
  </SimpleForm>
);

export const CustomerList = (props) => (
  <List actions={<ListActions resource="customers" />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="fullName" />
      <TextField source="email" />
      <TextField source="numphone" />
      <BooleanField source="active" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const CustomerShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="fullName" />
      <TextField source="email" />
      <TextField source="numphone" />
      <TextField source="role" />
      <BooleanField source="active" />
      <TextField source="createdAt" />
      <TextField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const CustomerEdit = (props) => (
  <Edit {...props}>
    <CustomerForm />
  </Edit>
);

export const CustomerCreate = (props) => (
  <Create {...props}>
    <CustomerForm />
  </Create>
);
