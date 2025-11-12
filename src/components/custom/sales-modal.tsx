import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS, PAYMENT_METHODS } from "@/lib/constants"
import { useSalesStore } from "@/lib/stores/sale"
import { SaleParamsSchema, type SaleParamsType } from "@/lib/validations/sale"
import { useFormik } from "formik"
import { Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { CustomSelect } from "./custom-select"
import { Textarea } from "../ui/textarea"
import { delayDebounceFn } from "@/lib/utils"
import type { Product } from "@/types/product"

export function SalesModal() {
  const closeRef = useRef<any>(null)
  const { setSales } = useSalesStore()
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [searchProductTerm, setSearchProductTerm,] = useState("")
  const [searchCustomerTerm, setSearchCustomerTerm,] = useState("")

  const fetchProducts = async () => {
    const r = await mainClient.get(API_ENDPOINTS.Products.Base, {
      params: { search: searchProductTerm }
    });
    if (r.status === 200) {
      setProducts(r.data.result.items)
    }
  }
  const fetchCustomers = async () => {
    const r = await mainClient.get(API_ENDPOINTS.Customers.Base, {
      params: { search: searchCustomerTerm }
    });
    if (r.status === 200) {
      setCustomers(r.data.result.items)
    }
  }

  const formik = useFormik<SaleParamsType>({
    initialValues: {
      productId: "",
      customerId: "",
      quantity: 1,
      paymentMethod: "",
      unitPrice: 0,
      notes: "",
    },
    onSubmit: async (values) => {
      const result = await mainClient.post(API_ENDPOINTS.Sales.Base, values)
      if (result.status === 201) {
        toast.success(result.data.message);
        await mainClient.get(API_ENDPOINTS.Sales.Base)
          .then(r => {
            setSales(r.data.result.items)
          })
        closeRef.current?.click()
        formik.resetForm()
      }
    },
    validateOnBlur: true,
    isInitialValid: false,
    validationSchema: SaleParamsSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    values,
    errors,
    touched,
    isSubmitting,
    isValid
  } = formik;

  useEffect(() => {
    if (searchCustomerTerm.length) {
      const delayDebounce = delayDebounceFn(fetchCustomers);
      return () => clearTimeout(delayDebounce);
    } else {

      if (!customers.length) {
        fetchCustomers();
      }
    }
  }, [searchCustomerTerm]);

  useEffect(() => {
    if (searchProductTerm.length) {
      const delayDebounce = delayDebounceFn(fetchProducts);
      return () => clearTimeout(delayDebounce);
    } else {

      if (!products.length) {
        fetchProducts();
      }
    }
  }, [searchProductTerm]);


  useEffect(() => {
    const product = products.find(v => v.id === values.productId)
    if (product) {
      setFieldValue('unitPrice', product.unitPrice)
    }
  }, [values.productId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Sale</DialogTitle>
          <DialogDescription>
            Record a new sale transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <CustomSelect
              id="productId"
              label="PRODUCT*"
              searchText={searchProductTerm}
              onSearchChange={setSearchProductTerm}
              onChange={v => setFieldValue("productId", v)}
              containerClass="w-full"
              className="w-full"
              placeholder={"Select a product to sell"}
              options={products.map(v => ({ label: v.name, value: v.id }))}
            />
            <Input
              id="quantity"
              type="number"
              label="QUANTITY*"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              placeholder={"1"}
              value={values.quantity}
              error={errors.quantity}
              touched={touched.quantity}
            />
          </div>
          <div className="flex gap-2">
            <Input
              id="unitPrice"
              type="number"
              label="UNIT PRICE*"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              value={values.unitPrice}
              error={errors.unitPrice}
              touched={touched.unitPrice}
            />
            <CustomSelect
              id="paymentMethod"
              label="PAYMENT METHOD*"
              containerClass="w-full"
              className="w-full"
              onChange={v => setFieldValue('paymentMethod', v)}
              placeholder={"Select a Payment Method"}
              options={PAYMENT_METHODS}
            />
          </div>
          <div className="flex gap-2">
            <CustomSelect
              id="customerId"
              label="CUSTOMER*"
              searchText={searchCustomerTerm}
              onSearchChange={setSearchCustomerTerm}
              onChange={v => setFieldValue("customerId", v)}
              containerClass="w-full"
              className="w-full"
              placeholder={"Select a customer"}
              options={customers.map(v => ({ label: v.name, value: v.id }))}
            />
            <Input
              id="total"
              type="number"
              label="TOTAL AMOUNT"
              disabled
              containerClass="w-full"
              value={values.unitPrice * values.quantity}
            />
          </div>
          <div className="flex gap-2">
            <Textarea
              id="notes"
              label="NOTES"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              value={values.notes}
              error={errors.notes}
              touched={touched.notes}
            />
          </div>
          <DialogFooter className="justify-start!">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isValid}>Record Sale</Button>
            <DialogClose asChild className="hidden">
              <Button variant="outline" ref={closeRef}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
