import React from "react";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
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
  TextField,
  TextInput,
  useRecordContext,
} from "react-admin";
import ListActions from "./ListActions";

const IMAGE_BASE_URL = "http://localhost:8080/api/image/products/";

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

const resolveImageUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${IMAGE_BASE_URL}${value}`;
};

const ProductGallery = () => {
  const record = useRecordContext();
  const gallery = Array.isArray(record?.images) ? record.images : [];
  const images =
    gallery.length > 0 ? gallery : record?.photo ? [{ imageUrl: record.photo, thumbnail: true }] : [];

  if (images.length === 0) {
    return <div style={{ color: "#64748b" }}>Không có ảnh phụ</div>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
      {images.map((image, index) => (
        <figure key={image?.id ?? `${image?.imageUrl ?? "image"}-${index}`} style={{ margin: 0, width: 160 }}>
          <img
            src={resolveImageUrl(image?.imageUrl)}
            alt={image?.imageUrl || `Ảnh ${index + 1}`}
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderRadius: 12,
              border: image?.thumbnail ? "2px solid #e11d48" : "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          />
          <figcaption style={{ marginTop: 6, fontSize: 12, color: "#475569" }}>
            {image?.thumbnail ? "Ảnh chính" : `Ảnh phụ ${index + 1}`}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <Box
    style={{
      display: "grid",
      gridTemplateColumns: "220px 1fr",
      gap: 16,
      padding: "14px 0",
      borderBottom: "1px solid #e2e8f0",
    }}
  >
    <Typography variant="subtitle2" style={{ color: "#475569", fontWeight: 800 }}>
      {label}
    </Typography>
    <Typography variant="body1" style={{ color: "#0f172a", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {value || "Không có"}
    </Typography>
  </Box>
);

const ProductShowContent = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Box style={{ padding: 24, maxWidth: "100%", overflowX: "hidden" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" style={{ marginBottom: 24, fontWeight: 900 }}>
            {record.title || "Chi tiết sản phẩm"}
          </Typography>
          <InfoRow label="ID" value={record.id} />
          <InfoRow label="Tên sản phẩm" value={record.title} />
          <Box style={{ padding: "14px 0", borderBottom: "1px solid #e2e8f0" }}>
            <Typography variant="subtitle2" style={{ color: "#475569", fontWeight: 800, marginBottom: 12 }}>
              Ảnh đại diện
            </Typography>
            <ImageField source="photo" label="" />
          </Box>
          <Box style={{ padding: "14px 0", borderBottom: "1px solid #e2e8f0" }}>
            <Typography variant="subtitle2" style={{ color: "#475569", fontWeight: 800, marginBottom: 12 }}>
              Ảnh phụ
            </Typography>
            <ProductGallery />
          </Box>
          <InfoRow label="Danh mục" value={record?.category?.title} />
          <InfoRow label="Thương hiệu" value={record?.brand?.name} />
          <InfoRow label="Giá gốc" value={formatPrice(record?.originalPrice)} />
          <InfoRow label="Giá khuyến mãi" value={formatPrice(record?.price)} />
          <InfoRow label="Tồn kho" value={record.stockQuantity} />
          <InfoRow label="Mô tả ngắn" value={record.description} />
          <InfoRow label="Mô tả chi tiết" value={record.detailedDescription} />
          <InfoRow label="Hiển thị" value={record.visible ? "Có" : "Không"} />
          <InfoRow label="Nổi bật" value={record.featured ? "Có" : "Không"} />
          <InfoRow label="Bán chạy" value={record.bestSeller ? "Có" : "Không"} />
          <InfoRow label="Ngày tạo" value={record.createdAt} />
          <InfoRow label="Cập nhật lần cuối" value={record.updatedAt} />
        </CardContent>
      </Card>
    </Box>
  );
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
  <List actions={<ListActions resource="products" hasFilters />} filters={<ProductFilter />} {...props}>
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
    <ProductShowContent />
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
