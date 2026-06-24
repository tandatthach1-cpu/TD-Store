import React from "react";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  ImageField,
  ImageInput,
  List,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";

const BrandForm = () => (
  <SimpleForm defaultValues={{ active: true }}>
    <TextInput source="name" label="Tên thương hiệu" fullWidth />
    <TextInput source="description" label="Mô tả" multiline fullWidth />
    <BooleanInput source="active" label="Đang hoạt động" />
    <ImageField source="logo" label="Logo hiện tại" />
    <ImageInput source="file" label="Tải logo từ máy tính" accept="image/*,.svg">
      <ImageField source="src" title="Xem trước" />
    </ImageInput>
  </SimpleForm>
);

export const BrandList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ImageField source="logo" title="name" label="Logo" />
      <TextField source="name" label="Tên thương hiệu" />
      <TextField source="description" label="Mô tả" />
      <BooleanField source="active" label="Hoạt động" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const BrandShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" label="Tên thương hiệu" />
      <ImageField source="logo" label="Logo" />
      <TextField source="description" label="Mô tả" />
      <BooleanField source="active" label="Hoạt động" />
      <TextField source="createdAt" label="Ngày tạo" />
      <TextField source="updatedAt" label="Cập nhật lần cuối" />
    </SimpleShowLayout>
  </Show>
);

export const BrandEdit = (props) => (
  <Edit {...props}>
    <BrandForm />
  </Edit>
);

export const BrandCreate = (props) => (
  <Create {...props}>
    <BrandForm />
  </Create>
);
