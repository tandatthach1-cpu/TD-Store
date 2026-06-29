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
  List,
  NumberField,
  NumberInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";
import ListActions from "./ListActions";

const BannerForm = () => (
  <SimpleForm defaultValues={{ active: true, sortOrder: 0 }}>
    <TextInput source="title" label="Tiêu đề" fullWidth />
    <TextInput source="imageUrl" label="Tên tệp / URL ảnh" fullWidth />
    <ImageField source="imagePreview" label="Ảnh hiện tại" />
    <TextInput source="link" label="Liên kết" fullWidth />
    <NumberInput source="sortOrder" label="Thứ tự hiển thị" />
    <BooleanInput source="active" label="Đang hoạt động" />
  </SimpleForm>
);

export const BannerList = (props) => (
  <List actions={<ListActions resource="banners" />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ImageField source="imagePreview" label="Ảnh" />
      <TextField source="title" label="Tiêu đề" />
      <TextField source="link" label="Liên kết" />
      <NumberField source="sortOrder" label="Thứ tự" />
      <BooleanField source="active" label="Hoạt động" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const BannerShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" label="Tiêu đề" />
      <ImageField source="imagePreview" label="Ảnh" />
      <TextField source="link" label="Liên kết" />
      <NumberField source="sortOrder" label="Thứ tự" />
      <BooleanField source="active" label="Hoạt động" />
      <TextField source="createdAt" label="Ngày tạo" />
      <TextField source="updatedAt" label="Cập nhật lần cuối" />
    </SimpleShowLayout>
  </Show>
);

export const BannerEdit = (props) => (
  <Edit {...props}>
    <BannerForm />
  </Edit>
);

export const BannerCreate = (props) => (
  <Create {...props}>
    <BannerForm />
  </Create>
);
