import { getCurrentUser } from './storefront';

export const WISHLIST_CHANGE_EVENT = 'tdphone-wishlist-change';

const getWishlistKey = () => {
  const user = getCurrentUser();
  return user?.id ? `tdphone-wishlist-user-${user.id}` : null;
};

const readWishlistForKey = (key) => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id != null) : [];
  } catch {
    return [];
  }
};

const writeWishlistForKey = (key, items) => {
  if (typeof window === 'undefined') return items;

  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_CHANGE_EVENT, { detail: { items, key } }));
  return items;
};

const readWishlist = () => {
  const key = getWishlistKey();
  if (!key) return [];
  return readWishlistForKey(key);
};

export const getWishlistItems = () => readWishlist();

export const getWishlistCount = () => readWishlist().length;

export const isWishlisted = (productId) =>
  readWishlist().some((item) => String(item.id) === String(productId));

const normalizeWishlistItem = (product) => {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name || product.title || 'Sản phẩm',
    img: product.img || product.photo || '',
    category: product.category || product.categoryName || '',
    price: product.price,
    originalPrice: product.originalPrice,
    priceStatic: product.priceStatic,
    originalPriceStatic: product.originalPriceStatic,
    discountPriceStatic: product.discountPriceStatic,
    rawPrice: product.rawPrice,
    hasDiscount: Boolean(product.hasDiscount),
    featured: Boolean(product.featured),
    bestSeller: Boolean(product.bestSeller),
  };
};

export const addToWishlist = (product) => {
  const item = normalizeWishlistItem(product);
  if (!item) return [];

  const key = getWishlistKey();
  if (!key) return [];
  const current = readWishlist();
  const next = current.some((entry) => String(entry.id) === String(item.id)) ? current : [item, ...current];
  return writeWishlistForKey(key, next);
};

export const removeFromWishlist = (productId) => {
  const key = getWishlistKey();
  if (!key) return [];
  const next = readWishlist().filter((item) => String(item.id) !== String(productId));
  return writeWishlistForKey(key, next);
};

export const toggleWishlistItem = (product) => {
  const key = getWishlistKey();
  if (!key) return [];
  const current = readWishlist();
  const exists = current.some((item) => String(item.id) === String(product?.id));
  const next = exists
    ? current.filter((item) => String(item.id) !== String(product?.id))
    : [normalizeWishlistItem(product), ...current].filter(Boolean);
  return writeWishlistForKey(key, next);
};

export const clearWishlist = () => {
  const key = getWishlistKey();
  if (!key) return [];
  return writeWishlistForKey(key, []);
};
