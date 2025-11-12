import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { useProductStore } from "@/lib/stores/product";
import { useRef } from "react";
import { toast } from "sonner";

export const DeleteProductModal = () => {
    const closeRef = useRef<any>(null)
    const { isDeleteModalOpen, setIsDeleteModalOpen, selectedProduct, setProducts } = useProductStore();

    if (!isDeleteModalOpen || !selectedProduct) return null;

    const handleConfirmDelete = async () => {
        // Add your delete logic here
        console.log('Deleting product:', selectedProduct);
        const result = await mainClient.delete(API_ENDPOINTS.Products.ById(selectedProduct.id))
        if (result.status === 200) {
            toast.success(result.data.message);
            await mainClient.get(API_ENDPOINTS.Products.Base)
                .then(r => {
                    setProducts(r.data.result.items)
                })
            closeRef.current?.click()
        }
        // Close modal after deletion
        setIsDeleteModalOpen(false);
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={handleCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <div className="flex items-start">
                    <div className="shrink-0">
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                            Delete Product
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete <span className="font-semibold">{selectedProduct.name}</span>? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
