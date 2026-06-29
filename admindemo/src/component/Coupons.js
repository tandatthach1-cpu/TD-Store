import React from "react";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DateTimeInput,
  DeleteButton,
  Edit,
  EditButton,
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
  minValue,
  required,
} from "react-admin";
import ListActions from "./ListActions";

const typeChoices = [
  { id: "PERCENT", name: "Phần trăm" },
  { id: "FIXED", name: "Số tiền cố định" },
];

const viNumberFormat = new Intl.NumberFormat("vi-VN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;
  return viNumberFormat.format(numberValue);
};

const parseMoney = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return Number(String(value).replace(/\./g, "").replace(/,/g, "").replace(/\s/g, ""));
};

const CouponForm = () => (
  <SimpleForm defaultValues={{ active: true, discountType: "PERCENT", quantity: 1 }} sanitizeEmptyValues>
    <TextInput
      source="code"
      label="Mã giảm giá"
      fullWidth
      helperText="Ví dụ: SUMMER10"
      validate={[required()]}
      parse={(value) => (value ? value.trim().toUpperCase() : "")}
    />
    <TextInput source="title" label="Tên chương trình" fullWidth validate={[required()]} />
    <SelectInput source="discountType" label="Loại giảm giá" choices={typeChoices} validate={[required()]} />
    <NumberInput
      source="discountValue"
      label="Giá trị giảm"
      format={formatMoney}
      parse={parseMoney}
      validate={[required(), minValue(0)]}
    />
    <NumberInput
      source="minOrderValue"
      label="Đơn tối thiểu"
      format={formatMoney}
      parse={parseMoney}
      validate={[minValue(0)]}
    />
    <NumberInput
      source="maxDiscountValue"
      label="Giảm tối đa"
      format={formatMoney}
      parse={parseMoney}
      validate={[minValue(0)]}
    />
    <NumberInput source="quantity" label="Số lượng" validate={[minValue(0)]} />
    <DateTimeInput source="startAt" label="Bắt đầu" fullWidth />
    <DateTimeInput source="endAt" label="Kết thúc" fullWidth />
    <BooleanInput source="active" label="Đang kích hoạt" />
  </SimpleForm>
);

export const CouponList = (props) => (
  <List actions={<ListActions resource="coupons" />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="code" label="Mã" />
      <TextField source="title" label="Tên" />
      <TextField source="discountType" label="Loại" />
      <NumberField
        source="discountValue"
        label="Giá trị"
        options={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
      />
      <NumberField source="quantity" label="Số lượng" />
      <BooleanField source="active" label="Kích hoạt" />
      <DateField source="startAt" label="Bắt đầu" showTime />
      <DateField source="endAt" label="Kết thúc" showTime />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const CouponShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="code" label="Mã giảm giá" />
      <TextField source="title" label="Tên chương trình" />
      <TextField source="discountType" label="Loại giảm giá" />
      <NumberField
        source="discountValue"
        label="Giá trị giảm"
        options={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
      />
      <NumberField
        source="minOrderValue"
        label="Đơn tối thiểu"
        options={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
      />
      <NumberField
        source="maxDiscountValue"
        label="Giảm tối đa"
        options={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
      />
      <NumberField source="quantity" label="Số lượng" />
      <BooleanField source="active" label="Đang kích hoạt" />
      <DateField source="startAt" label="Bắt đầu" showTime />
      <DateField source="endAt" label="Kết thúc" showTime />
    </SimpleShowLayout>
  </Show>
);

export const CouponEdit = (props) => (
  <Edit {...props}>
    <CouponForm />
  </Edit>
);

export const CouponCreate = (props) => (
  <Create {...props}>
    <CouponForm />
  </Create>
);
