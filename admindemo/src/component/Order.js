import React, { useEffect, useState } from "react";
import {
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  FunctionField,
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
  useNotify,
  useUpdate,
} from "react-admin";

const ORDER_STATUS_CHOICES = [
  { id: "PENDING", name: "Chờ xác nhận" },
  { id: "CONFIRMED", name: "Đã xác nhận" },
  { id: "SHIPPING", name: "Đang giao hàng" },
  { id: "DELIVERED", name: "Đã giao hàng" },
  { id: "CANCELLED", name: "Đã hủy" },
];

const PAYMENT_STATUS_CHOICES = [
  { id: "PENDING", name: "Chờ thanh toán" },
  { id: "PAID", name: "Đã thanh toán" },
  { id: "UNPAID", name: "Chưa thanh toán" },
  { id: "REFUNDED", name: "Đã hoàn tiền" },
];

const formatChoiceLabel = (choices, value) =>
  choices.find((choice) => choice.id === value)?.name || value || "Không rõ";

const QuickEditSelect = ({ record, field, choices, defaultValue, successMessage, errorMessage }) => {
  const notify = useNotify();
  const [update, { isPending }] = useUpdate();
  const [value, setValue] = useState(record?.[field] || defaultValue);

  useEffect(() => {
    setValue(record?.[field] || defaultValue);
  }, [record, record?.id, record?.[field], defaultValue, field]);

  const handleSave = () => {
    if (!record?.id) return;

    update(
      "orders",
      {
        id: record.id,
        data: {
          ...record,
          [field]: value,
        },
        previousData: record,
      },
      {
        onSuccess: () => notify(successMessage, { type: "info" }),
        onError: () => notify(errorMessage, { type: "warning" }),
      }
    );
  };

  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center" }}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <select
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClick={(event) => event.stopPropagation()}
        style={{
          minWidth: 160,
          borderRadius: 10,
          border: "1px solid #cbd5e1",
          padding: "8px 10px",
          background: "#fff",
        }}
      >
        {choices.map((choice) => (
          <option key={choice.id} value={choice.id}>
            {choice.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        onMouseDown={(event) => event.stopPropagation()}
        disabled={isPending || value === record?.[field]}
        style={{
          border: "none",
          borderRadius: 10,
          padding: "8px 12px",
          cursor: isPending || value === record?.[field] ? "not-allowed" : "pointer",
          background: "#e11d48",
          color: "#fff",
          fontWeight: 800,
        }}
      >
        {isPending ? "Đang lưu..." : "Lưu"}
      </button>
    </div>
  );
};

const OrderStatusQuickEdit = ({ record }) => (
  <QuickEditSelect
    record={record}
    field="status"
    choices={ORDER_STATUS_CHOICES}
    defaultValue="PENDING"
    successMessage="Đã cập nhật trạng thái đơn hàng"
    errorMessage="Không thể cập nhật trạng thái đơn hàng"
  />
);

const PaymentStatusQuickEdit = ({ record }) => (
  <QuickEditSelect
    record={record}
    field="paymentStatus"
    choices={PAYMENT_STATUS_CHOICES}
    defaultValue="PENDING"
    successMessage="Đã cập nhật trạng thái thanh toán"
    errorMessage="Không thể cập nhật trạng thái thanh toán"
  />
);

const OrderForm = () => (
  <SimpleForm>
    <ReferenceInput label="Khách hàng" source="userId" reference="customers">
      <SelectInput optionText="username" />
    </ReferenceInput>
    <TextInput source="customerName" label="Tên khách hàng" fullWidth />
    <TextInput source="customerPhone" label="Số điện thoại" fullWidth />
    <TextInput source="address" label="Địa chỉ" fullWidth />
    <SelectInput source="status" label="Trạng thái đơn hàng" fullWidth choices={ORDER_STATUS_CHOICES} />
    <SelectInput
      source="paymentStatus"
      label="Trạng thái thanh toán"
      fullWidth
      choices={PAYMENT_STATUS_CHOICES}
    />
    <NumberInput source="totalAmount" label="Tổng tiền" />
    <TextInput source="note" label="Ghi chú" multiline fullWidth />
  </SimpleForm>
);

export const listOrder = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="orderCode" label="Mã đơn" />
      <TextField source="user.username" label="Tài khoản" />
      <TextField source="customerName" label="Tên khách hàng" />
      <NumberField source="totalAmount" label="Tổng tiền" />
      <FunctionField label="Trạng thái" render={(record) => formatChoiceLabel(ORDER_STATUS_CHOICES, record?.status)} />
      <FunctionField label="Cập nhật nhanh" render={(record) => <OrderStatusQuickEdit record={record} />} />
      <FunctionField label="Thanh toán" render={(record) => <PaymentStatusQuickEdit record={record} />} />
      <TextField source="date" label="Ngày đặt" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const OrderShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="orderCode" label="Mã đơn" />
      <TextField source="user.username" label="Tài khoản" />
      <TextField source="customerName" label="Tên khách hàng" />
      <TextField source="customerPhone" label="Số điện thoại" />
      <TextField source="address" label="Địa chỉ" />
      <NumberField source="totalAmount" label="Tổng tiền" />
      <FunctionField label="Trạng thái" render={(record) => formatChoiceLabel(ORDER_STATUS_CHOICES, record?.status)} />
      <FunctionField
        label="Thanh toán"
        render={(record) => formatChoiceLabel(PAYMENT_STATUS_CHOICES, record?.paymentStatus)}
      />
      <TextField source="note" label="Ghi chú" />
      <TextField source="date" label="Ngày đặt" />
      <TextField source="updatedAt" label="Cập nhật lần cuối" />
    </SimpleShowLayout>
  </Show>
);

export const EditOrder = (props) => (
  <Edit {...props}>
    <OrderForm />
  </Edit>
);

export const CreateOrder = (props) => (
  <Create {...props}>
    <OrderForm />
  </Create>
);
