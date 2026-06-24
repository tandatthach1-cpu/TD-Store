import React from "react";
import { Admin, Resource } from "react-admin";
import AdminPanel from "./component/AdminPanel";
import { listCategory, editCategory, CreateCategory, categoryShow } from "./component/Category";
import {
  ListProduct,
  EditProduct,
  CreateProduct,
  ProductShow,
} from "./component/Products";
import { listOrder, EditOrder, CreateOrder, OrderShow } from "./component/Order";
import { listOrderDetail } from "./component/OrderDetail";
import { listCart } from "./component/Cart";
import { listCartDetail } from "./component/CartDetail";
import { ContentList, ContentEdit, ContentCreate, ContentShow } from "./component/Contents";
import { BrandList, BrandEdit, BrandCreate, BrandShow } from "./component/Brands";
import { CustomerList, CustomerEdit, CustomerCreate, CustomerShow } from "./component/Customers";
import { listUser } from "./component/Users";
import {
  AdminAccountList,
  AdminAccountEdit,
  AdminAccountCreate,
  AdminAccountShow,
} from "./component/AdminAccounts";
import { CouponList, CouponEdit, CouponCreate, CouponShow } from "./component/Coupons";
import { ContactList, ContactEdit, ContactCreate, ContactShow } from "./component/Contacts";
import {
  ProductReviewList,
  ProductReviewEdit,
  ProductReviewCreate,
  ProductReviewShow,
} from "./component/ProductReviews";
import { SlideShowList, SlideShowEdit, SlideShowCreate } from "./component/SlideShow";
import { BannerList, BannerEdit, BannerCreate, BannerShow } from "./component/Banners";
import dataProvider from "./component/customDataProvider";
import AdminLayout from "./component/AdminLayout";
import adminTheme from "./component/adminTheme";

const App = () => (
  <Admin dashboard={AdminPanel} dataProvider={dataProvider} layout={AdminLayout} theme={adminTheme}>
    <Resource
      name="products"
      options={{ label: "Sản phẩm" }}
      list={ListProduct}
      show={ProductShow}
      edit={EditProduct}
      create={CreateProduct}
    />
    <Resource
      name="categories"
      options={{ label: "Danh mục" }}
      list={listCategory}
      show={categoryShow}
      edit={editCategory}
      create={CreateCategory}
    />
    <Resource
      name="brands"
      options={{ label: "Thương hiệu" }}
      list={BrandList}
      show={BrandShow}
      edit={BrandEdit}
      create={BrandCreate}
    />
    <Resource
      name="orders"
      options={{ label: "Đơn hàng" }}
      list={listOrder}
      show={OrderShow}
      edit={EditOrder}
      create={CreateOrder}
    />
    <Resource
      name="customers"
      options={{ label: "Khách hàng" }}
      list={CustomerList}
      show={CustomerShow}
      edit={CustomerEdit}
      create={CustomerCreate}
    />
    <Resource
      name="adminAccounts"
      options={{ label: "Tài khoản quản trị" }}
      list={AdminAccountList}
      show={AdminAccountShow}
      edit={AdminAccountEdit}
      create={AdminAccountCreate}
    />
    <Resource
      name="productReviews"
      options={{ label: "Đánh giá sản phẩm" }}
      list={ProductReviewList}
      show={ProductReviewShow}
      edit={ProductReviewEdit}
      create={ProductReviewCreate}
    />
    <Resource
      name="slideShows"
      options={{ label: "Trình chiếu" }}
      list={SlideShowList}
      edit={SlideShowEdit}
      create={SlideShowCreate}
    />
    <Resource
      name="banners"
      options={{ label: "Banner" }}
      list={BannerList}
      show={BannerShow}
      edit={BannerEdit}
      create={BannerCreate}
    />
    <Resource
      name="contents"
      options={{ label: "Tin tức / Blog" }}
      list={ContentList}
      show={ContentShow}
      edit={ContentEdit}
      create={ContentCreate}
    />
    <Resource
      name="contactMessages"
      options={{ label: "Liên hệ" }}
      list={ContactList}
      show={ContactShow}
      edit={ContactEdit}
      create={ContactCreate}
    />
    <Resource
      name="coupons"
      options={{ label: "Mã giảm giá" }}
      list={CouponList}
      show={CouponShow}
      edit={CouponEdit}
      create={CouponCreate}
    />
    <Resource name="users" options={{ label: "Người dùng" }} list={listUser} />
    <Resource name="carts" options={{ label: "Giỏ hàng" }} list={listCart} />
    <Resource name="cartDetails" options={{ label: "Chi tiết giỏ" }} list={listCartDetail} />
    <Resource name="orderDetails" options={{ label: "Chi tiết đơn" }} list={listOrderDetail} />
  </Admin>
);

export default App;
