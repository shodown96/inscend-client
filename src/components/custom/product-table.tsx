import { StockPill } from "@/components/custom/product-pill";
import { useProductStore } from "@/lib/stores/product";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { DeleteProductModal } from "./delete-product-modal";

// Dropdown Menu Component
export const ActionDropdown = ({ product }: { product: Product }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { openEditModalOpen, openDeleteModalOpen } = useProductStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleEdit = () => {
        openEditModalOpen(product);
        setIsOpen(false);
    };

    const handleDelete = () => {
        openDeleteModalOpen(product);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-20 mt-2 w-48 rounded-md shadow-lg bg-white border z-1000">
                    <div className="py-1" role="menu">
                        <button
                            onClick={handleEdit}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            role="menuitem"
                        >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Table Component
export const ProductTable = ({ products }: { products: Product[] }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: "", direction: 'asc' });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProducts = useMemo(() => {
        let sorted = [...products];
        if (sortConfig.key) {
            sorted.sort((a: any, b: any) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'unitPrice') {
                    aVal = parseFloat(aVal);
                    bVal = parseFloat(bVal);
                }

                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sorted;
    }, [products, sortConfig]);

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig.key !== columnKey) {
            return (
                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortConfig.direction === 'asc' ? (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <>
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3 text-left">
                                <Checkbox className="rounded" />
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">
                                    PRODUCT
                                    <SortIcon columnKey="name" />
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                SKU
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('category')}
                            >
                                <div className="flex items-center">
                                    CATEGORY
                                    <SortIcon columnKey="category" />
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                STOCK
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('unitPrice')}
                            >
                                <div className="flex items-center">
                                    PRICE
                                    <SortIcon columnKey="unitPrice" />
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                STATUS
                            </th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map((product, index) => {
                            return (
                                <tr key={product.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <Checkbox className="rounded" />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-700">{product.sku}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-700">{product.category}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-700">{product.stock}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-700">${product.unitPrice.toFixed(2)}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StockPill stock={product.stock} />
                                    </td>
                                    <td className="px-4 py-4">
                                        <ActionDropdown product={product} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteProductModal />
        </>
    );
};