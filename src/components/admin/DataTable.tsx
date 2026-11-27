import { useMemo, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import type { Column, Entity } from "../../types/admin.types";

interface DataTableProps<T extends Entity> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  searchKeys?: (keyof T)[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

const DataTable = <T extends Entity>({
  columns,
  data,
  loading,
  pageSize = 8,
  searchKeys,
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys?.length) return data;
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
    );
  }, [data, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = rows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const hasActions = !!onEdit || !!onDelete;

  return (
    <div className="adm-card adm-table-card">
      {searchKeys && (
        <div className="adm-table-toolbar">
          <div className="adm-search">
            <FiSearch />
            <input
              value={query}
              placeholder="Search..."
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <span className="adm-table-count">{rows.length} results</span>
        </div>
      )}

      <div className="adm-table-scroll">
        <table className="adm-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {hasActions && <th style={{ width: "100px" }} />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="adm-table-empty">
                  Loading...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="adm-table-empty">
                  No data found
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      <div className="adm-row-actions">
                        {onEdit && (
                          <button type="button" onClick={() => onEdit(row)} title="Edit">
                            <FiEdit2 />
                          </button>
                        )}
                        {onDelete && (
                          <button type="button" className="danger" onClick={() => onDelete(row)} title="Delete">
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="adm-table-footer">
          <Pagination
            count={totalPages}
            page={safePage}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            size="small"
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;