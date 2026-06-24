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
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";

const roleChoices = [
  { id: "SUPER_ADMIN", name: "Quản trị cao nhất" },
  { id: "EDITOR", name: "Biên tập viên" },
  { id: "MANAGER", name: "Quản lý" },
];

const AdminAccountForm = () => (
  <SimpleForm defaultValues={{ active: true, role: "SUPER_ADMIN" }}>
    <TextInput source="username" label="Tên đăng nhập" fullWidth />
    <TextInput source="fullName" label="Họ tên" fullWidth />
    <TextInput source="email" label="Email" fullWidth />
    <TextInput source="password" label="Mật khẩu" type="password" fullWidth />
    <SelectInput source="role" label="Vai trò" choices={roleChoices} />
    <BooleanInput source="active" label="Hoạt động" />
  </SimpleForm>
);

export const AdminAccountList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="username" label="Tên đăng nhập" />
      <TextField source="fullName" label="Họ tên" />
      <TextField source="email" label="Email" />
      <TextField source="role" label="Vai trò" />
      <BooleanField source="active" label="Hoạt động" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const AdminAccountShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="username" label="Tên đăng nhập" />
      <TextField source="fullName" label="Họ tên" />
      <TextField source="email" label="Email" />
      <TextField source="role" label="Vai trò" />
      <BooleanField source="active" label="Hoạt động" />
      <TextField source="createdAt" label="Ngày tạo" />
      <TextField source="updatedAt" label="Cập nhật lần cuối" />
    </SimpleShowLayout>
  </Show>
);

export const AdminAccountEdit = (props) => (
  <Edit {...props}>
    <AdminAccountForm />
  </Edit>
);

export const AdminAccountCreate = (props) => (
  <Create {...props}>
    <AdminAccountForm />
  </Create>
);
