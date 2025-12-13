import BrainstormDialog from "@/components/custom/brainstorm-dialog";
import { CustomerView } from "@/components/custom/customer-details";
import useAPIQuery from "@/hooks/use-api-query";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME } from "@/lib/constants";
import { useCustomerStore } from "@/lib/stores/customer";
import type { Sale } from "@/types/sales";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CustomerDetailsPage() {
  const { id } = useParams()
  const { selectedCustomer, setSelectedCustomer } = useCustomerStore();
  const { setPagination } = useAPIQuery()
  const [sales, setSales] = useState<Sale[]>([])

  const fetchData = async () => {
    const r = await mainClient.get(API_ENDPOINTS.Customers.ById(String(id)));
    if (r.status === 200) {
      setSelectedCustomer(r.data.result)
    }
  }

  const fetchCustomerSales = async () => {
    const r = await mainClient.get(API_ENDPOINTS.Sales.Base, {
      params: { customerId: selectedCustomer?.id }
    });
    if (r.status === 200) {
      setSales(r.data.result.items)
      setPagination({
        total: r.data.result.totalPages,
        currentPage: r.data.result.currentPage,
      });
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerSales()
    }
  }, [selectedCustomer])
  if (!selectedCustomer) return null
  return (
    <div className="p-10">
      <title>{`${selectedCustomer.name} | ${APP_NAME}`}</title>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-semibold text-xl">{selectedCustomer.name}</h4>
          <p className="text-sm">See who they are and how they engage with your store.</p>
        </div>
        <div className="flex gap-2">
          <BrainstormDialog />
        </div>
      </div>

      <CustomerView
        customer={selectedCustomer}
        sales={sales}
      />
    </div>
  )
}
