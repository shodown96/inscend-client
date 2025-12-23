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
import { API_ENDPOINTS, CATEGORIES } from "@/lib/constants"
import { ProductParamsSchema, type ProductParamsType } from "@/lib/validations/product"
import { useFormik } from "formik"
import { Plus } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"
import { CustomSelect } from "./custom-select"
import { useProductStore } from "@/lib/stores/product"

export function ProductModal({ buttonText = "Add Product", onFormSubmit = () => { } }: {
  buttonText?: string,
  onFormSubmit?: () => void
}) {
  const closeRef = useRef<any>(null)
  const { setProducts } = useProductStore()
  const formik = useFormik<ProductParamsType>({
    initialValues: {
      name: "",
      sku: "",
      category: "",
      unitPrice: "" as any,
      costPrice: "" as any,
      supplier: "",
      stock: 1,
      lowStockThreshold: 1,
    },
    onSubmit: async (values) => {
      const result = await mainClient.post(API_ENDPOINTS.Products.Base, values)
      if (result.status === 201) {
        toast.success(result.data.message);
        await mainClient.get(API_ENDPOINTS.Products.Base)
          .then(r => {
            setProducts(r.data.result.items)
            onFormSubmit()
          })
        closeRef.current?.click()
        formik.resetForm()
      }
    },
    validateOnBlur: true,
    validationSchema: ProductParamsSchema,
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-max">
          <Plus />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader className="text-left">
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter product data
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              id="name"
              label="PRODUCT NAME*"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              placeholder={"Enter product name"}
              value={values.name}
              error={errors.name}
              touched={touched.name}
            />
            <Input
              id="sku"
              label="STOCK KEEPING UNIT*"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              placeholder={"e.g WH-1000XM4"}
              value={values.sku}
              error={errors.sku}
              touched={touched.sku}
            />
          </div>
          <div className="flex gap-2">
            <CustomSelect
              id="category"
              label="CATEGORY*"
              containerClass="w-full"
              className="w-full"
              onChange={v => setFieldValue('category', v)}
              placeholder={"Select a category"}
              options={CATEGORIES}
            />
            <Input
              id="stock"
              type="number"
              label="CURRENT STOCK*"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              value={values.stock}
              error={errors.stock}
              touched={touched.stock}
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
            <Input
              id="costPrice"
              type="number"
              label="COST PRICE*"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              value={values.costPrice}
              error={errors.costPrice}
              touched={touched.costPrice}
            />
          </div>
          <Input
            id="discountPrice"
            type="number"
            label="DISCOUNT PRICE (OPTIONAL)"
            placeholder="e.g $20"
            onBlur={handleBlur}
            onChange={handleChange}
            containerClass="w-full"
            value={values.discountPrice}
            error={errors.discountPrice}
            touched={touched.discountPrice}
          />
          <div className="flex gap-2">
            <Input
              id="lowStockThreshold"
              type="number"
              label="LOW STOCK THRESHOLD*"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              value={values.lowStockThreshold}
              error={errors.lowStockThreshold}
              touched={touched.lowStockThreshold}
            />
            <Input
              id="supplier"
              label="SUPPLIER INFORMATION"
              onBlur={handleBlur}
              onChange={handleChange}
              containerClass="w-full"
              value={values.supplier}
              error={errors.supplier}
              touched={touched.supplier}
            />
          </div>
          <DialogFooter className="justify-start!">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isValid}>Save Product</Button>
            <DialogClose asChild className="hidden">
              <Button variant="outline" ref={closeRef}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
