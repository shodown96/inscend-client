import EmptyIcon from "@/assets/icons/empty.svg?react";
import BrainstormDialog from "@/components/custom/brainstorm-dialog";
import { ImportModal } from "@/components/custom/import-modal";
import SearchInput from "@/components/custom/input-search";
import { ProductModal } from "@/components/custom/product-modal";
import { ProductTable } from "@/components/custom/product-table";
import { TablePagination } from "@/components/custom/table-pagination";
import { Button } from "@/components/ui/button";
import useAPIQuery from "@/hooks/use-api-query";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME } from "@/lib/constants";
import { useProductStore } from "@/lib/stores/product";
import { delayDebounceFn } from "@/lib/utils";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

export default function InventoryPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const productId = searchParams.get("product")
    const { products, setProducts, setSelectedProduct } = useProductStore();
    const { query, pagination, setQuery, setPagination } = useAPIQuery()

    const fetchData = async () => {
        const r = await mainClient.get(API_ENDPOINTS.Products.Base, {
            params: query
        });
        if (r.data.result.items) {
            setProducts(r.data.result.items)
            setPagination({
                total: r.data.result.total,
                totalPages: r.data.result.totalPages,
                currentPage: r.data.result.currentPage,
            });
        }
    }
    const fetchProductData = async () => {
        if (!productId || true) return;
        const r = await mainClient.get(API_ENDPOINTS.Products.ById("productId"));
        if (r.data.result.items) {
            setSearchParams("")
            setSelectedProduct(r.data.result.items)
        }
    }

    useEffect(() => {
        if (productId) {
            fetchProductData()
        }
    }, [productId])


    useEffect(() => {
        if (query.search.length) {
            const delayDebounce = delayDebounceFn(fetchData);
            return () => clearTimeout(delayDebounce);
        } else if (query.page) {
            fetchData()
        }
    }, [query.search, query.page]);

    return (
        <div className="p-10">
            <title>{`Inventory | ${APP_NAME}`}</title>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="text-xl font-semibold">Inventory Management</h4>
                    <p>Here's what's happening with your business.</p>
                </div>
                <div className="flex gap-2">
                    <ProductModal />
                    <ImportModal type={'Products'} />
                    <BrainstormDialog outlined />
                </div>
            </div>
            {products.length ? (
                <>
                    <div className="mb-4 flex justify-end">
                        <SearchInput
                            value={query.search}
                            onValueChange={v => setQuery({ search: v })}
                        />
                    </div>
                    <ProductTable products={products} />
                    <TablePagination
                        pagination={pagination}
                        onPageChange={page => setQuery({ page })}
                    />
                </>
            ) : (
                <div className="bg-white rounded p-3 py-10 flex flex-col gap-4 justify-center items-center text-center mb-4">
                    <EmptyIcon />
                    <div>Let’s stock your store</div>
                    <div>Use our structured template to import products in bulk</div>
                    <div className="flex gap-2">

                        <ImportModal type={'Products'} />
                        <Button variant={'outline'}>Download Template</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
