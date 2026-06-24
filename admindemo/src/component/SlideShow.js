import React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  EditButton,
  TextInput,
  Create,
  ImageField,
  ImageInput,
  useRedirect,
  useNotify,
} from "react-admin";

export const SlideShowList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" label="Tiêu đề" />
      <ImageField source="photo" title="Ảnh" />
      <EditButton />
    </Datagrid>
  </List>
);

export const SlideShowEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" label="Tiêu đề" fullWidth />
      <ImageInput source="file" label="Tải ảnh trình chiếu" accept="image/*">
        <ImageField source="src" title="Xem trước" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const SlideShowCreate = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data) => {
    notify("Tạo mới thành công");
    redirect("list", "slideShows");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }} redirect="slideShows">
      <SimpleForm>
        <TextInput source="title" label="Tiêu đề" fullWidth />
        <ImageInput source="file" label="Tải ảnh trình chiếu" accept="image/*">
          <ImageField source="src" title="Xem trước" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};
