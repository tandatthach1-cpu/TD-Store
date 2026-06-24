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

const ContactForm = () => (
  <SimpleForm defaultValues={{ resolved: false }}>
    <TextInput source="name" label="Họ tên" fullWidth />
    <TextInput source="email" label="Email" fullWidth />
    <TextInput source="phone" label="Số điện thoại" fullWidth />
    <TextInput source="subject" label="Tiêu đề" fullWidth />
    <TextInput source="message" label="Nội dung" multiline fullWidth />
    <BooleanInput source="resolved" label="Đã xử lý" />
  </SimpleForm>
);

export const ContactList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" label="Họ tên" />
      <TextField source="email" label="Email" />
      <TextField source="subject" label="Tiêu đề" />
      <BooleanField source="resolved" label="Đã xử lý" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ContactShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" label="Họ tên" />
      <TextField source="email" label="Email" />
      <TextField source="phone" label="Số điện thoại" />
      <TextField source="subject" label="Tiêu đề" />
      <TextField source="message" label="Nội dung" />
      <BooleanField source="resolved" label="Đã xử lý" />
      <TextField source="createdAt" label="Ngày tạo" />
      <TextField source="updatedAt" label="Cập nhật lần cuối" />
    </SimpleShowLayout>
  </Show>
);

export const ContactEdit = (props) => (
  <Edit {...props}>
    <ContactForm />
  </Edit>
);

export const ContactCreate = (props) => (
  <Create {...props}>
    <ContactForm />
  </Create>
);
