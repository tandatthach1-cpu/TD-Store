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

const CategoryForm = () => (
  <SimpleForm defaultValues={{ active: true }}>
    <TextInput source="title" label="Tên danh mục" fullWidth />
    <TextInput source="description" label="Mô tả" multiline fullWidth />
    <BooleanInput source="active" label="Đang hoạt động" />
    <ImageField source="photo" label="Ảnh hiện tại" />
    <ImageInput source="file" label="Tải ảnh danh mục" accept="image/*">
      <ImageField source="src" title="Xem trước" />
    </ImageInput>
  </SimpleForm>
);

export const listCategory = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ImageField source="photo" title="title" label="Ảnh" />
      <TextField source="title" label="Tên danh mục" />
      <TextField source="description" label="Mô tả" />
      <BooleanField source="active" label="Hoạt động" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const categoryShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" label="Tên danh mục" />
      <ImageField source="photo" label="Ảnh" />
      <TextField source="description" label="Mô tả" />
      <BooleanField source="active" label="Hoạt động" />
      <TextField source="createdAt" label="Ngày tạo" />
      <TextField source="updatedAt" label="Cập nhật lần cuối" />
    </SimpleShowLayout>
  </Show>
);

export const editCategory = (props) => (
  <Edit {...props}>
    <CategoryForm />
  </Edit>
);

export const CreateCategory = (props) => (
  <Create {...props}>
    <CategoryForm />
  </Create>
);
