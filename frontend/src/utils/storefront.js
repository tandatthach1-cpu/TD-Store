import heroFallback from '../assets/hero.png';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const PLACEHOLDER_IMAGE = heroFallback;

export const getPageContent = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

export const fetchJson = async (url, options) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu (${response.status})`);
  }

  return response.json();
};

export const getImageUrl = (folder, fileName) => {
  if (!fileName) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//i.test(fileName)) return fileName;
  return `${API_BASE_URL}/image/${folder}/${fileName}`;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

// Format dạng tĩnh theo yêu cầu: 1.000.000 (không phải 1000.000)
// Quy ước: coi giá trị đầu vào là VND (ví dụ 1000000) và format theo hàng nghìn với dấu '.'
// Output dạng chuỗi (không kèm ký hiệu tiền tệ).
export const formatPriceStaticDot000 = (value) => {
  const n = parseCurrency(value);
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(n);
};



export const parseCurrency = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value.replace(/[^0-9]/g, '')) || 0;
  return 0;
};

export const normalizeProduct = (product) => {
  const num = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(String(v).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : null;
  };

  // Giá gốc (original/old/list)
  const originalRaw =
    num(product.originalPrice) ??
    num(product.priceOriginal) ??
    num(product.oldPrice) ??
    num(product.listPrice) ??
    num(product.price) ??
    0;

  // Giá đang giảm (discount/current/final)
  const discountRaw =
    num(product.discountPrice) ??
    num(product.salePrice) ??
    num(product.currentPrice) ??
    num(product.finalPrice) ??
    num(product.price) ??
    0;

  const hasDiscount = discountRaw !== originalRaw;

  return {
    id: product.id,
    name: product.title || product.name || 'Sản phẩm',
    description: product.description || '',

    // Giữ nguyên các field cũ để tránh phá UI khác
    rawPrice: Number(product.price) || 0,
    price: formatCurrency(product.price),
    priceStatic: formatPriceStaticDot000(Number(product.price) || 0),

    // Field mới phục vụ hiển thị giá gốc + giá giảm
    originalPrice: originalRaw,
    originalPriceStatic: formatPriceStaticDot000(originalRaw),

    discountPrice: discountRaw,
    discountPriceStatic: formatPriceStaticDot000(discountRaw),

    hasDiscount,

    img: getImageUrl('products', product.photo),
    category: product.category?.title || product.category?.name || '',
    categoryId: product.category?.id || product.categoryId || null,
    featured: Boolean(product.featured),
    bestSeller: Boolean(product.bestSeller),
  };
};



export const normalizeCategory = (category) => ({
  id: category.id,
  title: category.title || category.name || 'Danh mục',
  description: category.description || 'Sản phẩm chính hãng, đa dạng phân khúc và nhiều ưu đãi dễ tiếp cận.',
  photo: getImageUrl('categories', category.photo),
});

export const normalizeNews = (item) => ({
  id: item.id,
  title: item.title || 'Tin mới',
  description: item.description || '',
  img: item.image || (item.img ? getImageUrl('contents', item.img) : PLACEHOLDER_IMAGE),
  date: item.date || 'Mới cập nhật',
  category: item.category || 'Tin tức',
});

export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const user = JSON.parse(stored);
    return {
      ...user,
      fullName: user.fullName || user.username || '',
      numphone: user.numphone || user.phone || '',
      email: user.email || '',
    };
  } catch {
    return null;
  }
};

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
