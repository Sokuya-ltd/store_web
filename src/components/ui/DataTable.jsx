import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
    data,
    columns,
    searchable = true,
    searchPlaceholder = "Search...",
    pageSize = 10,
}) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    return (
        <div className="w-full">
            {/* Search */}
            {searchable && (
                <div className="mb-4">
                    <input
                        type="text"
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full md:w-80 px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg"
                    />
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto overflow-y-visible border border-white/10">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 text-left text-xs font-semibold text-neutral-400 uppercase">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 whitespace-nowrap"
                                        style={{ width: header.getSize() }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-white" : ""
                                                    }`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <span className="text-neutral-500">
                                                        {{
                                                            asc: <ChevronUp size={14} />,
                                                            desc: <ChevronDown size={14} />,
                                                        }[header.column.getIsSorted()] ?? <ChevronsUpDown size={14} />}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center text-sm text-neutral-400"
                                >
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm">
                <div className="text-neutral-400">
                    Showing{" "}
                    <span className="font-medium text-neutral-200">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-neutral-200">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-neutral-200">
                        {table.getFilteredRowModel().rows.length}
                    </span>{" "}
                    results
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="flex items-center gap-1 px-3 py-1.5 border border-white/20 text-neutral-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                            .filter((page) => {
                                const current = table.getState().pagination.pageIndex + 1;
                                return page === 1 || page === table.getPageCount() || Math.abs(page - current) <= 1;
                            })
                            .map((page, index, array) => {
                                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                                return (
                                    <span key={page} className="flex items-center">
                                        {showEllipsis && <span className="px-2 text-neutral-500">...</span>}
                                        <button
                                            onClick={() => table.setPageIndex(page - 1)}
                                            className={`w-8 h-8 text-sm font-medium rounded transition-colors ${
                                                table.getState().pagination.pageIndex === page - 1
                                                    ? "bg-orange-400 text-white"
                                                    : "text-neutral-300 hover:bg-white/10"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    </span>
                                );
                            })}
                    </div>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="flex items-center gap-1 px-3 py-1.5 border border-white/20 text-neutral-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
