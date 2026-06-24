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
  NumberField,
  NumberInput,
  ReferenceInput,
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";

const ProductReviewForm = () => (
  <SimpleForm defaultValues={{ rating: 5, approved: true }}>
    <ReferenceInput source="productId" reference="products" label="Sản phẩm">
      <SelectInput optionText="title" />
    </ReferenceInput>
    <ReferenceInput source="userId" reference="customers" label="Khách hàng">
      <SelectInput optionText="username" />
    </ReferenceInput>
    <NumberInput source="rating" label="Số sao" />
    <TextInput source="comment" label="Bình luận" multiline fullWidth />
    <BooleanInput source="approved" label="Đã duyệt" />
  </SimpleForm>
);

export const ProductReviewList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="product.title" label="Sản phẩm" />
      <TextField source="user.username" label="Khách hàng" />
      <NumberField source="rating" label="Số sao" />
      <BooleanField source="approved" label="Đã duyệt" />
      <TextField source="comment" label="Bình luận" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ProductReviewShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="product.title" label="Sản phẩm" />
      <TextField source="user.username" label="Khách hàng" />
      <NumberField source="rating" label="Số sao" />
      <TextField source="comment" label="Bình luận" />
      <BooleanField source="approved" label="Đã duyệt" />
      <TextField source="createdAt" label="Ngày tạo" />
    </SimpleShowLayout>
  </Show>
);

export const ProductReviewEdit = (props) => (
  <Edit {...props}>
    <ProductReviewForm />
  </Edit>
);

export const ProductReviewCreate = (props) => (
  <Create {...props}>
    <ProductReviewForm />
  </Create>
);
