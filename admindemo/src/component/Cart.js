import React from "react";
import { List, Datagrid, TextField } from "react-admin";

export const listCart = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="user.id" label="Khách hàng" />
    </Datagrid>
  </List>
);
