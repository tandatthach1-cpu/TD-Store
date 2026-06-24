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
  FunctionField,
  ImageField,
  ImageInput,
  List,
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

const viNumberFormat = new Intl.NumberFormat("vi-VN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;
  return viNumberFormat.format(numberValue);
};

const parsePrice = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return Number(String(value).replace(/\./g, "").replace(/,/g, ""));
};

const ProductFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Tìm sản phẩm" source="search" alwaysOn />
    <ReferenceInput source="categoryId" reference="categories" alwaysOn label="Danh mục">
      <SelectInput optionText="title" />
    </ReferenceInput>
    <ReferenceInput source="brandId" reference="brands" alwaysOn label="Thương hiệu">
      <SelectInput optionText="name" />
    </ReferenceInput>
    <SelectInput
      source="visible"
      label="Hiển thị"
      choices={[
        { id: true, name: "Hiển thị" },
        { id: false, name: "Ẩn" },
      ]}
    />
  </Filter>
);

const ProductForm = () => (
  <SimpleForm defaultValues={{ visible: true, featured: false, bestSeller: false, stockQuantity: 0 }}>
    <TextInput source="title" label="Tên sản phẩm" fullWidth />
    <TextInput source="description" label="Mô tả ngắn" multiline fullWidth />
    <TextInput source="detailedDescription" label="Mô tả chi tiết" multiline fullWidth />
    <ReferenceInput label="Danh mục" source="categoryId" reference="categories">
      <SelectInput optionText="title" />
    </ReferenceInput>
    <ReferenceInput label="Thương hiệu" source="brandId" reference="brands">
      <SelectInput optionText="name" />
    </ReferenceInput>
    <NumberInput source="originalPrice" label="Giá gốc" format={formatPrice} parse={parsePrice} />
    <NumberInput source="price" label="Giá khuyến mãi" format={formatPrice} parse={parsePrice} />
    <NumberInput source="stockQuantity" label="Tồn kho" />
    <BooleanInput source="visible" label="Hiển thị" />
    <BooleanInput source="featured" label="Nổi bật" />
    <BooleanInput source="bestSeller" label="Bán chạy" />
    <ImageField source="photo" title="title" label="Ảnh đại diện hiện tại" />
    <ImageInput source="file" label="Ảnh đại diện" accept="image/*">
      <ImageField source="src" title="Xem trước" />
    </ImageInput>
    <ImageInput source="galleryFiles" label="Ảnh phụ" accept="image/*" multiple>
      <ImageField source="src" title="Xem trước" />
    </ImageInput>
  </SimpleForm>
);

export const ListProduct = (props) => (
  <List filters={<ProductFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ImageField source="photo" title="title" label="Ảnh" />
      <TextField source="title" label="Tên sản phẩm" />
      <TextField source="category.title" label="Danh mục" />
      <TextField source="brand.name" label="Thương hiệu" />
      <FunctionField source="originalPrice" label="Giá gốc" render={(record) => formatPrice(record?.originalPrice)} />
      <FunctionField source="price" label="Giá khuyến mãi" render={(record) => formatPrice(record?.price)} />
      <TextField source="stockQuantity" label="Tồn kho" />
      <BooleanField source="visible" label="Hiển thị" />
      <BooleanField source="featured" label="Nổi bật" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ProductShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" label="Tên sản phẩm" />
      <ImageField source="photo" label="Ảnh đại diện" />
      <TextField source="category.title" label="Danh mục" />
      <TextField source="brand.name" label="Thương hiệu" />
      <FunctionField source="originalPrice" label="Giá gốc" render={(record) => formatPrice(record?.originalPrice)} />
      <FunctionField source="price" label="Giá khuyến mãi" render={(record) => formatPrice(record?.price)} />
      <TextField source="stockQuantity" label="Tồn kho" />
      <TextField source="description" label="Mô tả ngắn" />
      <TextField source="detailedDescription" label="Mô tả chi tiết" />
      <BooleanField source="visible" label="Hiển thị" />
      <BooleanField source="featured" label="Nổi bật" />
      <BooleanField source="bestSeller" label="Bán chạy" />
      <TextField source="createdAt" label="Ngày tạo" />
      <TextField source="updatedAt" label="Cập nhật lần cuối" />
    </SimpleShowLayout>
  </Show>
);

export const EditProduct = (props) => (
  <Edit {...props}>
    <ProductForm />
  </Edit>
);

export const CreateProduct = (props) => (
  <Create {...props}>
    <ProductForm />
  </Create>
);
