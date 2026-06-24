import React from "react";
import { List, Datagrid, TextField } from "react-admin";

export const listCartDetail = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="product.title" label="Sản phẩm" />
      <TextField source="cart.id" label="Giỏ hàng" />
    </Datagrid>
  </List>
);
