import { fetchUtils } from "react-admin";

const apiUrl = "http://localhost:8080/api";
const httpClient = fetchUtils.fetchJson;

const resourceImageConfig = {
  products: { source: "photo", folder: "products" },
  categories: { source: "photo", folder: "categories" },
  brands: { source: "logo", folder: "brands" },
  slideShows: { source: "photo", folder: "slideShows" },
  contents: { source: "imageUrl", previewField: "imagePreview" },
  banners: { source: "imageUrl", previewField: "imagePreview" },
};

const multipartResources = new Set(["products", "categories", "brands", "slideShows", "contents"]);

const normalizeImageName = (value) => {
  if (typeof value !== "string") return value;
  return value
    .split(",")
    .map((item) => item.trim())
    .find(Boolean) || "";
};

const resolveImageUrl = (resource, fileName) => {
  if (!fileName) return fileName;
  if (/^https?:\/\//i.test(fileName)) return fileName;
  const normalized = normalizeImageName(fileName);
  if (!normalized) return "";
  if (resource === "contents") return `${apiUrl}/contents/images/${normalized}`;
  const config = resourceImageConfig[resource];
  if (!config?.folder) return normalized;
  return `${apiUrl}/image/${config.folder}/${normalized}`;
};

const normalizeRecord = (resource, item) => {
  const config = resourceImageConfig[resource];
  if (resource === "products") {
    const images = Array.isArray(item?.images) ? item.images : [];
    const galleryFiles = images
      .filter((image) => !image?.thumbnail)
      .map((image, index) => {
        const imageUrl = normalizeImageName(image?.imageUrl);
        return {
          id: image?.id ?? index,
          src: resolveImageUrl(resource, imageUrl),
          title: imageUrl,
          thumbnail: Boolean(image?.thumbnail),
          sortOrder: image?.sortOrder ?? index,
        };
      });

    const normalizedProduct = {
      ...item,
      galleryFiles,
    };

    if (!config || !item?.[config.source]) {
      return normalizedProduct;
    }

    const normalizedImageName = normalizeImageName(item[config.source]);
    const previewUrl = resolveImageUrl(resource, normalizedImageName);

    return {
      ...normalizedProduct,
      [config.source]: previewUrl,
    };
  }

  if (!config || !item?.[config.source]) {
    return item;
  }

  const normalizedImageName = normalizeImageName(item[config.source]);
  const previewUrl = resolveImageUrl(resource, normalizedImageName);

  if (config.previewField) {
    return {
      ...item,
      [config.source]: normalizedImageName,
      [config.previewField]: previewUrl,
    };
  }

  return {
    ...item,
    [config.source]: previewUrl,
  };
};

const buildListUrl = (resource, params) => {
  const { page, perPage } = params.pagination;
  const query = new URLSearchParams({
    page: String(page - 1),
    size: String(perPage),
  });

  if (params.sort?.field) query.set("sortField", params.sort.field);
  if (params.sort?.order) query.set("sortOrder", params.sort.order);

  Object.entries(params.filter || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "object" && value?.id !== undefined) {
      query.set(key, String(value.id));
      return;
    }
    query.set(key, String(value));
  });

  return `${apiUrl}/${resource}?${query.toString()}`;
};

const extractRawFile = (fileValue) => {
  if (!fileValue) return null;
  if (Array.isArray(fileValue)) return fileValue[0]?.rawFile || null;
  return fileValue.rawFile || null;
};

const extractRawFiles = (fileValue) => {
  if (!fileValue) return [];
  if (!Array.isArray(fileValue)) return fileValue.rawFile ? [fileValue.rawFile] : [];
  return fileValue.map((item) => item?.rawFile).filter(Boolean);
};

const appendScalar = (formData, key, value) => {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, value);
};

const appendFormData = (resource, data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "file" || key === "galleryFiles" || key === "imagePreview") return;
    if (resource === "contents" && key === "imageUrl") return;
    if (Array.isArray(value) || (typeof value === "object" && value?.rawFile)) return;

    appendScalar(formData, key, typeof value === "object" && value?.id !== undefined ? value.id : value);
  });

  const rawFile = extractRawFile(data.file);
  if (rawFile) {
    formData.append("file", rawFile);
  } else if (resource === "contents" && data.imageUrl) {
    formData.append("imageUrl", normalizeImageName(data.imageUrl));
  }

  return formData;
};

const uploadProductGalleryImages = async (productId, galleryFiles) => {
  const rawFiles = extractRawFiles(galleryFiles);
  if (!productId || rawFiles.length === 0) return;

  await Promise.all(
    rawFiles.map((rawFile, index) => {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("file", rawFile);
      formData.append("thumbnail", "false");
      formData.append("sortOrder", String(index));

      return httpClient(`${apiUrl}/productImages`, {
        method: "POST",
        body: formData,
      });
    })
  );
};

const deleteProductGalleryImages = async (galleryFiles) => {
  const removedIds = (galleryFiles || [])
    .map((item) => item?.id)
    .filter((id) => id !== undefined && id !== null && String(id).length > 0);

  if (removedIds.length === 0) return;

  await Promise.all(
    removedIds.map((id) =>
      httpClient(`${apiUrl}/productImages/${id}`, {
        method: "DELETE",
      })
    )
  );
};

const sanitizeProductPayload = (data) => {
  const payload = { ...data };
  delete payload.file;
  delete payload.galleryFiles;
  delete payload.imagePreview;
  return payload;
};

const dataProvider = {
  getList: (resource, params) => {
    const url = buildListUrl(resource, params);
    return httpClient(url).then(({ json }) => {
      const list = Array.isArray(json) ? json : json.content || [];
      return {
        data: list.map((item) => normalizeRecord(resource, item)),
        total: Array.isArray(json) ? list.length : json.totalElements ?? list.length,
      };
    });
  },

  getOne: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: normalizeRecord(resource, json),
    }));
  },

  getMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`).then(({ json }) => normalizeRecord(resource, json))
      )
    );
    return { data: results };
  },

  getManyReference: (resource, params) =>
    dataProvider.getList(resource, {
      pagination: params.pagination,
      sort: params.sort,
      filter: {
        ...(params.filter || {}),
        [params.target]: params.id,
      },
    }),

  update: (resource, params) => {
    const hasUploadFile = Boolean(extractRawFile(params.data?.file));
    const hasGalleryFiles = resource === "products" && extractRawFiles(params.data?.galleryFiles).length > 0;
    const previousGalleryFiles = resource === "products" ? params.previousData?.galleryFiles || [] : [];
    const nextGalleryFiles = resource === "products" ? params.data?.galleryFiles || [] : [];
    const nextGalleryIds = new Set(
      nextGalleryFiles
        .map((item) => item?.id)
        .filter((id) => id !== undefined && id !== null)
        .map((id) => String(id))
    );
    const removedGalleryFiles =
      resource === "products"
        ? previousGalleryFiles.filter((item) => item?.id !== undefined && !nextGalleryIds.has(String(item.id)))
        : [];
    const options = multipartResources.has(resource) || hasUploadFile
      ? {
          method: "PUT",
          body: appendFormData(resource, params.data),
        }
      : {
          method: "PUT",
          headers: new Headers({ "Content-Type": "application/json" }),
          body: JSON.stringify(sanitizeProductPayload(params.data)),
        };

    return httpClient(`${apiUrl}/${resource}/${params.id}`, options).then(async ({ json }) => {
      if (resource === "products" && removedGalleryFiles.length > 0) {
        await deleteProductGalleryImages(removedGalleryFiles);
      }

      if (resource === "products" && hasGalleryFiles) {
        await uploadProductGalleryImages(json.id ?? params.id, params.data.galleryFiles);
      }

      return {
        data: normalizeRecord(resource, json),
      };
    });
  },

  create: (resource, params) => {
    const hasUploadFile = Boolean(extractRawFile(params.data?.file));
    const hasGalleryFiles = resource === "products" && extractRawFiles(params.data?.galleryFiles).length > 0;
    const options = multipartResources.has(resource) || hasUploadFile
      ? {
          method: "POST",
          body: appendFormData(resource, params.data),
        }
      : {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          body: JSON.stringify(sanitizeProductPayload(params.data)),
        };

    return httpClient(`${apiUrl}/${resource}`, options).then(async ({ json }) => {
      if (resource === "products" && hasGalleryFiles) {
        await uploadProductGalleryImages(json.id, params.data.galleryFiles);
      }

      return {
        data: normalizeRecord(resource, json),
      };
    });
  },

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, { method: "DELETE" }).then(() => ({
      data: { id: params.id },
    })),

  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => httpClient(`${apiUrl}/${resource}/${id}`, { method: "DELETE" })));
    return { data: params.ids };
  },
};

export default dataProvider;
