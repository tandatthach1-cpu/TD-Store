const WISHLIST_KEY = 'tdphone-wishlist';
export const WISHLIST_CHANGE_EVENT = 'tdphone-wishlist-change';

const readWishlist = () => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id != null) : [];
  } catch {
    return [];
  }
};

const writeWishlist = (items) => {
  if (typeof window === 'undefined') return items;

  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_CHANGE_EVENT, { detail: { items } }));
  return items;
};

export const getWishlistItems = () => readWishlist();

export const getWishlistCount = () => readWishlist().length;

export const isWishlisted = (productId) => readWishlist().some((item) => String(item.id) === String(productId));

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

  const current = readWishlist();
  const next = current.some((entry) => String(entry.id) === String(item.id))
    ? current
    : [item, ...current];
  return writeWishlist(next);
};

export const removeFromWishlist = (productId) => {
  const next = readWishlist().filter((item) => String(item.id) !== String(productId));
  return writeWishlist(next);
};

export const toggleWishlistItem = (product) => {
  const current = readWishlist();
  const exists = current.some((item) => String(item.id) === String(product?.id));
  const next = exists
    ? current.filter((item) => String(item.id) !== String(product?.id))
    : [normalizeWishlistItem(product), ...current].filter(Boolean);
  return writeWishlist(next);
};

export const clearWishlist = () => writeWishlist([]);

