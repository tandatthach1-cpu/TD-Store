import React from "react";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  Edit,
  EditButton,
  ImageField,
  ImageInput,
  List,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";

export const listUser = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" label="Tên đăng nhập" />
      <TextField source="numphone" label="Số điện thoại" />
      <TextField source="pass" label="Mật khẩu" />
      <TextField source="email" label="Email" />
      <BooleanField source="active" label="Hoạt động" />
      <EditButton />
    </Datagrid>
  </List>
);

export const editUser = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="username" label="Tên đăng nhập" fullWidth />
      <TextInput source="pass" label="Mật khẩu" fullWidth />
      <TextInput source="numphone" label="Số điện thoại" fullWidth />
      <TextInput source="email" label="Email" fullWidth />
      <ImageInput source="file" label="Ảnh đại diện" accept="image/*">
        <ImageField source="src" title="Xem trước" />
      </ImageInput>
      <BooleanInput source="active" label="Hoạt động" />
    </SimpleForm>
  </Edit>
);

export const CreateUser = (props) => {
  return (
    <Create {...props} redirect="users">
      <SimpleForm>
        <TextInput source="username" label="Tên đăng nhập" fullWidth />
        <TextInput source="pass" label="Mật khẩu" fullWidth />
        <TextInput source="numphone" label="Số điện thoại" fullWidth />
        <TextInput source="email" label="Email" fullWidth />
        <ImageInput source="file" label="Ảnh đại diện" accept="image/*">
          <ImageField source="src" title="Xem trước" />
        </ImageInput>
        <BooleanInput source="active" label="Hoạt động" />
      </SimpleForm>
    </Create>
  );
};
