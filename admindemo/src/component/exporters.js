import { downloadCSV } from "react-admin";

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";

  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const buildCsv = (rows) => {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];

  return lines.join("\n");
};

const pick = (record, fields) =>
  fields.reduce((acc, field) => {
    acc[field.label] = field.getValue ? field.getValue(record) : record?.[field.source] ?? "";
    return acc;
  }, {});

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const formatBoolean = (value) => (value ? "Yes" : "No");

const resourceConfigs = {
  products: [
    { label: "id", source: "id" },
    { label: "title", source: "title" },
    { label: "category", getValue: (record) => record?.category?.title || "" },
    { label: "brand", getValue: (record) => record?.brand?.name || "" },
    { label: "originalPrice", source: "originalPrice" },
    { label: "price", source: "price" },
    { label: "stockQuantity", source: "stockQuantity" },
    { label: "visible", getValue: (record) => formatBoolean(record?.visible) },
    { label: "featured", getValue: (record) => formatBoolean(record?.featured) },
    { label: "bestSeller", getValue: (record) => formatBoolean(record?.bestSeller) },
    { label: "createdAt", getValue: (record) => formatDate(record?.createdAt) },
    { label: "updatedAt", getValue: (record) => formatDate(record?.updatedAt) },
  ],
  categories: [
    { label: "id", source: "id" },
    { label: "title", source: "title" },
    { label: "description", source: "description" },
    { label: "active", getValue: (record) => formatBoolean(record?.active) },
    { label: "createdAt", getValue: (record) => formatDate(record?.createdAt) },
    { label: "updatedAt", getValue: (record) => formatDate(record?.updatedAt) },
  ],
  brands: [
    { label: "id", source: "id" },
    { label: "name", source: "name" },
    { label: "description", source: "description" },
    { label: "active", getValue: (record) => formatBoolean(record?.active) },
    { label: "createdAt", getValue: (record) => formatDate(record?.createdAt) },
    { label: "updatedAt", getValue: (record) => formatDate(record?.updatedAt) },
  ],
  customers: [
    { label: "id", source: "id" },
    { label: "username", source: "username" },
    { label: "fullName", source: "fullName" },
    { label: "email", source: "email" },
    { label: "numphone", source: "numphone" },
    { label: "role", source: "role" },
    { label: "active", getValue: (record) => formatBoolean(record?.active) },
    { label: "createdAt", getValue: (record) => formatDate(record?.createdAt) },
    { label: "updatedAt", getValue: (record) => formatDate(record?.updatedAt) },
  ],
  orders: [
    { label: "id", source: "id" },
    { label: "orderCode", source: "orderCode" },
    { label: "customerName", source: "customerName" },
    { label: "customerPhone", source: "customerPhone" },
    { label: "status", source: "status" },
    { label: "paymentStatus", source: "paymentStatus" },
    { label: "totalAmount", source: "totalAmount" },
    { label: "date", source: "date" },
    { label: "updatedAt", getValue: (record) => formatDate(record?.updatedAt) },
  ],
  coupons: [
    { label: "id", source: "id" },
    { label: "code", source: "code" },
    { label: "title", source: "title" },
    { label: "discountType", source: "discountType" },
    { label: "discountValue", source: "discountValue" },
    { label: "minOrderValue", source: "minOrderValue" },
    { label: "maxDiscountValue", source: "maxDiscountValue" },
    { label: "quantity", source: "quantity" },
    { label: "active", getValue: (record) => formatBoolean(record?.active) },
    { label: "startAt", getValue: (record) => formatDate(record?.startAt) },
    { label: "endAt", getValue: (record) => formatDate(record?.endAt) },
  ],
  contents: [
    { label: "id", source: "id" },
    { label: "title", source: "title" },
    { label: "summary", source: "summary" },
    { label: "body", source: "body" },
    { label: "contentType", source: "contentType" },
    { label: "status", source: "status" },
    { label: "featured", getValue: (record) => formatBoolean(record?.featured) },
    { label: "displayOrder", source: "displayOrder" },
    { label: "createdAt", getValue: (record) => formatDate(record?.createdAt) },
    { label: "updatedAt", getValue: (record) => formatDate(record?.updatedAt) },
  ],
  banners: [
    { label: "id", source: "id" },
    { label: "title", source: "title" },
    { label: "link", source: "link" },
    { label: "sortOrder", source: "sortOrder" },
    { label: "active", getValue: (record) => formatBoolean(record?.active) },
    { label: "createdAt", getValue: (record) => formatDate(record?.createdAt) },
    { label: "updatedAt", getValue: (record) => formatDate(record?.updatedAt) },
  ],
  slideShows: [
    { label: "id", source: "id" },
    { label: "title", source: "title" },
    { label: "photo", source: "photo" },
  ],
};

export const getResourceExporter = (resource) => (records) => {
  const fields = resourceConfigs[resource];
  const rows = (records || []).map((record) =>
    fields ? pick(record, fields) : { ...record }
  );

  const csv = buildCsv(rows);
  downloadCSV(csv, `${resource}-${new Date().toISOString().slice(0, 10)}`);
};
