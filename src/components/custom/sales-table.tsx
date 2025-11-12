import { useSalesStore } from "@/lib/stores/sale";
import type { Sale } from "@/types/sales";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { DeleteSaleModal } from "./delete-sale-modal";
import { getInitials } from "@/lib/utils";

// Status Pill Component for Sales
const StatusPill = ({ status }: { status: string }) => {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {status}
        </span>
    );
};

// Payment Method Pill Component
const PaymentMethodPill = ({ method }: { method: string }) => {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {method}
        </span>
    );
};

// Action Dropdown Component
const ActionDropdown = ({ sale }: { sale: Sale }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { openEditModalOpen, openDeleteModalOpen } = useSalesStore();

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

    // const handleView = () => {
    //     console.log('View sale:', sale);
    //     setIsOpen(false);
    // };

    const handleEdit = () => {
        console.log('Edit sale:', sale);
        openEditModalOpen(sale);
        setIsOpen(false);
    };

    const handleDelete = () => {
        console.log('Delete sale:', sale);
        openDeleteModalOpen(sale);
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
                        {/* <button
                            onClick={handleView}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                        </button> */}
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

// Sales Table Component
export const SalesTable = ({ sales }: { sales: Sale[] }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: "", direction: 'asc' });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSales = useMemo(() => {
        let sorted = [...sales];
        if (sortConfig.key) {
            sorted.sort((a: any, b: any) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Handle nested properties
                if (sortConfig.key === 'customer.name') {
                    aVal = a.customer?.name || '';
                    bVal = b.customer?.name || '';
                }

                if (sortConfig.key === 'totalAmount') {
                    aVal = a.quantity * a.unitPrice;
                    bVal = b.quantity * b.unitPrice;
                }

                if (sortConfig.key === 'createdAt') {
                    aVal = new Date(aVal).getTime();
                    bVal = new Date(bVal).getTime();
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
    }, [sales, sortConfig]);

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

    // Format order ID
    const formatOrderId = (id: string) => {
        return `#ORD-${id.slice(-5).toUpperCase()}`;
    };

    // Get product list string
    const getProductList = (sale: Sale) => {
        if (!sale.product) return 'N/A';
        return `${sale.product.name} (${sale.quantity}x)`;
    };

    return (
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left">
                            <Checkbox className="rounded" />
                        </th>
                        <th
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('id')}
                        >
                            <div className="flex items-center">
                                ORDER ID
                                <SortIcon columnKey="id" />
                            </div>
                        </th>
                        <th
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('customer.name')}
                        >
                            <div className="flex items-center">
                                CUSTOMER
                                <SortIcon columnKey="customer.name" />
                            </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            PRODUCT
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            STATUS
                        </th>
                        <th
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('totalAmount')}
                        >
                            <div className="flex items-center">
                                AMOUNT
                                <SortIcon columnKey="totalAmount" />
                            </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            PAYMENT METHOD
                        </th>
                        <th
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('createdAt')}
                        >
                            <div className="flex items-center">
                                DATE & TIME
                                <SortIcon columnKey="createdAt" />
                            </div>
                        </th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedSales.map((sale, index) => {
                        const totalAmount = sale.quantity * sale.unitPrice;

                        return (
                            <tr key={sale.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <Checkbox className="rounded" />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatOrderId(sale.id)}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        {sale.customer ? (
                                            <>
                                                {sale.customer?.avatar ? (
                                                    <img
                                                        src={sale.customer.avatar.url}
                                                        alt={sale.customer.name}
                                                        className="size-8 rounded-full mr-2"
                                                    />
                                                ) : (
                                                    <div className="bg-primary text-white rounded-full size-8 flex justify-center items-center text-sm">
                                                        {getInitials(sale.customer?.name)}
                                                    </div>
                                                )}
                                            </>
                                        ) : null}
                                        <div className="text-sm text-gray-900">
                                            {sale.customer?.name || 'Guest'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="text-sm text-gray-700">
                                        {getProductList(sale)}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <StatusPill status="Completed" />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        ${totalAmount.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <PaymentMethodPill method={sale.paymentMethod} />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="text-sm text-gray-700">
                                        {format(new Date(sale.createdAt), 'M/d/yyyy hh:mm a')}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <ActionDropdown sale={sale} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <DeleteSaleModal />
        </div>
    );
};