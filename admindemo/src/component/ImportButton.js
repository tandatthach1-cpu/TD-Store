import React, { useRef, useState } from "react";
import { CloudUpload } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {
  useDataProvider,
  useNotify,
  useRefresh,
  useResourceContext,
} from "react-admin";

const JSON_ARRAY_KEYS = ["data", "items", "content"];

const stripControlFields = (record) => {
  if (!record || typeof record !== "object" || Array.isArray(record)) return record;

  const payload = { ...record };
  delete payload.id;
  delete payload.createdAt;
  delete payload.updatedAt;

  Object.entries(payload).forEach(([key, value]) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;

    if (value.id !== undefined && payload[`${key}Id`] === undefined) {
      payload[`${key}Id`] = value.id;
    }
  });

  return payload;
};

const normalizeValue = (value) => {
  if (value === "") return null;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === "true";
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

  return trimmed;
};

const parseCsvLine = (line) => {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
};

const parseCsv = (text) => {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    throw new Error("File CSV phải có ít nhất một dòng tiêu đề và một dòng dữ liệu.");
  }

  const headers = parseCsvLine(rows[0]).map((header) => header.trim());

  return rows.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((record, header, index) => {
      record[header] = normalizeValue(values[index] ?? "");
      return record;
    }, {});
  });
};

const parseImportFile = (text, fileName) => {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("File import đang trống.");
  }

  const lowerName = (fileName || "").toLowerCase();
  if (lowerName.endsWith(".csv")) {
    return parseCsv(trimmed);
  }

  const parsed = JSON.parse(trimmed);
  if (Array.isArray(parsed)) return parsed;
  for (const key of JSON_ARRAY_KEYS) {
    if (Array.isArray(parsed?.[key])) return parsed[key];
  }

  throw new Error("File JSON phải là mảng dữ liệu hoặc có trường data/items/content dạng mảng.");
};

const ImportButton = ({ resource }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const resourceContext = useResourceContext();
  const currentResource = resource ?? resourceContext;
  const inputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const records = parseImportFile(text, file.name);

      if (!Array.isArray(records) || records.length === 0) {
        notify("Không tìm thấy bản ghi hợp lệ để import.", { type: "warning" });
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const record of records) {
        try {
          await dataProvider.create(currentResource, {
            data: stripControlFields(record),
          });
          successCount += 1;
        } catch (error) {
          failCount += 1;
          // Tiếp tục import các dòng còn lại.
        }
      }

      refresh();

      if (failCount === 0) {
        notify(`Import thành công ${successCount} bản ghi vào ${currentResource}.`, { type: "info" });
      } else {
        notify(
          `Đã import ${successCount} bản ghi vào ${currentResource}, ${failCount} bản ghi lỗi.`,
          { type: "warning" }
        );
      }
    } catch (error) {
      notify(error.message || "Không thể import file.", { type: "warning" });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Button onClick={handlePickFile} disabled={isImporting} startIcon={<CloudUpload />}>
        Import
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,.csv,application/json,text/csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
};

export default ImportButton;
