import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS, PAYMENT_METHODS } from "@/lib/constants"
import { useSalesStore } from "@/lib/stores/sale"
import { delayDebounceFn } from "@/lib/utils"
import { SaleParamsSchema, type SaleParamsType } from "@/lib/validations/sale"
import type { Customer } from "@/types/customer"
import type { Product } from "@/types/product"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { CustomSelect } from "./custom-select"

export function EditSalesModal({ onFormSubmit = () => { } }: {
  onFormSubmit?: () => void
}) {
  const closeRef = useRef<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchProductTerm, setSearchProductTerm,] = useState("")
  const [searchCustomerTerm, setSearchCustomerTerm,] = useState("")
  const { setSales, selectedSale, isEditModalOpen, setIsEditModalOpen } = useSalesStore()
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
      const result = await mainClient.put(API_ENDPOINTS.Sales.ById(selectedSale?.id!), values)
      if (result.status === 201) {
        toast.success(result.data.message);
        await mainClient.get(API_ENDPOINTS.Products.Base)
          .then(r => {
            setSales(r.data.result.items)
            onFormSubmit()
          })
        closeRef.current?.click()
        formik.resetForm()
      }
    },
    validateOnBlur: true,
    validationSchema: SaleParamsSchema,
  });

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

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    values,
    errors,
    touched,
    isSubmitting,
    isValid
  } = formik;

  useEffect(() => {
    if (selectedSale?.id) {
      setValues({
        productId: selectedSale.productId,
        customerId: selectedSale.customerId || "",
        quantity: selectedSale.quantity,
        paymentMethod: selectedSale.paymentMethod,
        unitPrice: selectedSale.unitPrice,
        notes: selectedSale.notes,
      })
    }
  }, [selectedSale])


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


  if (!selectedSale) return;

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader className="text-left">
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
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
              defaultValue={selectedSale.productId || ""}
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
              defaultValue={selectedSale.paymentMethod}
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
              defaultValue={selectedSale.customerId || ""}
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
