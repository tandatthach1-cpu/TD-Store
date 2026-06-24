import React from "react";
import { List, Datagrid, TextField } from "react-admin";

export const listOrderDetail = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="order.id" label="Mã đơn" />
      <TextField source="product.title" label="Sản phẩm" />
      <TextField source="quantity" label="Số lượng" />
    </Datagrid>
  </List>
);
