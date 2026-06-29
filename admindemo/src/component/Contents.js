import React from "react";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  Filter,
  ImageField,
  ImageInput,
  List,
  NumberField,
  NumberInput,
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";
import ListActions from "./ListActions";

const contentTypeChoices = [
  { id: "NEWS", name: "Tin tức" },
  { id: "GUIDE", name: "Hướng dẫn" },
  { id: "PROMOTION", name: "Khuyến mãi" },
];

const statusChoices = [
  { id: "PUBLISHED", name: "Hiển thị" },
  { id: "DRAFT", name: "Nháp" },
  { id: "HIDDEN", name: "Ẩn" },
];

const ContentFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Tìm tiêu đề" source="search" alwaysOn />
    <SelectInput label="Loại nội dung" source="contentType" choices={contentTypeChoices} alwaysOn />
    <SelectInput label="Trạng thái" source="status" choices={statusChoices} alwaysOn />
  </Filter>
);

const ContentForm = () => (
  <SimpleForm defaultValues={{ contentType: "NEWS", status: "PUBLISHED", displayOrder: 0, featured: false }}>
    <TextInput source="title" label="Tiêu đề" fullWidth />
    <TextInput source="summary" label="Tóm tắt" multiline fullWidth />
    <TextInput source="body" label="Nội dung chi tiết" multiline fullWidth />
    <ImageField source="imagePreview" label="Ảnh hiện tại" />
    <ImageInput source="file" label="Tải ảnh" accept="image/*" multiple={false}>
      <ImageField source="src" title="Xem trước" />
    </ImageInput>
    <SelectInput source="contentType" label="Loại nội dung" choices={contentTypeChoices} />
    <SelectInput source="status" label="Trạng thái" choices={statusChoices} />
    <NumberInput source="displayOrder" label="Thứ tự hiển thị" />
    <BooleanInput source="featured" label="Đánh dấu nổi bật" />
  </SimpleForm>
);

export const ContentList = (props) => (
  <List actions={<ListActions resource="contents" hasFilters />} filters={<ContentFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ImageField source="imagePreview" label="Ảnh" />
      <TextField source="title" label="Tiêu đề" />
      <TextField source="contentType" label="Loại" />
      <TextField source="status" label="Trạng thái" />
      <BooleanField source="featured" label="Nổi bật" />
      <NumberField source="displayOrder" label="Thứ tự" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ContentShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" label="Tiêu đề" />
      <ImageField source="imagePreview" label="Ảnh" />
      <TextField source="summary" label="Tóm tắt" />
      <TextField source="body" label="Nội dung chi tiết" />
      <TextField source="contentType" label="Loại nội dung" />
      <TextField source="status" label="Trạng thái" />
      <BooleanField source="featured" label="Nổi bật" />
      <NumberField source="displayOrder" label="Thứ tự hiển thị" />
    </SimpleShowLayout>
  </Show>
);

export const ContentEdit = (props) => (
  <Edit {...props}>
    <ContentForm />
  </Edit>
);

export const ContentCreate = (props) => (
  <Create {...props}>
    <ContentForm />
  </Create>
);
