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
import { API_ENDPOINTS } from "@/lib/constants"
import { useCustomerStore } from "@/lib/stores/customer"
import { CustomerParamsSchema, type CustomerParamsType } from "@/lib/validations/customer"
import { useFormik } from "formik"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

export function EditCustomerModal({ onFormSubmit = () => { } }: { onFormSubmit?: () => void }) {
  const closeRef = useRef<any>(null)
  const { setCustomers, selectedCustomer, isEditModalOpen, setIsEditModalOpen } = useCustomerStore()

  const formik = useFormik<CustomerParamsType>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      notes: "",
    },
    onSubmit: async (values) => {
      const result = await mainClient.put(API_ENDPOINTS.Customers.ById(selectedCustomer?.id!), {
        ...values,
        email: values.email.toLowerCase()
      })
      if (result.status === 201) {
        toast.success(result.data.message);
        await mainClient.get(API_ENDPOINTS.Customers.Base)
          .then(r => {
            setCustomers(r.data.result.items)
            onFormSubmit()
          })
        closeRef.current?.click()
        formik.resetForm()
      }
    },
    validateOnBlur: true,
    validationSchema: CustomerParamsSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    values,
    errors,
    touched,
    isSubmitting,
    isValid
  } = formik;

  useEffect(() => {
    if (selectedCustomer?.id) {
      setValues({
        ...values,
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        location: selectedCustomer.location,
        notes: selectedCustomer.notes,
      })
    }
  }, [selectedCustomer])

  if (!selectedCustomer) return;

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Customer</DialogTitle>
          <DialogDescription>
            Update customer details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="NAME*"
            onBlur={handleBlur}
            onChange={handleChange}
            containerClass="w-full"
            placeholder={"Enter Customer Name"}
            value={values.name}
            error={errors.name}
            touched={touched.name}
          />

          <Input
            id="email"
            label="Email*"
            onBlur={handleBlur}
            onChange={handleChange}
            containerClass="w-full"
            placeholder={"Enter Customer Email"}
            value={values.email}
            error={errors.email}
            touched={touched.email}
          />


          <Input
            id="phone"
            label="Phone*"
            onBlur={handleBlur}
            onChange={handleChange}
            containerClass="w-full"
            placeholder={"Enter Customer Phone"}
            value={values.phone}
            error={errors.phone}
            touched={touched.phone}
          />

          {/* <CustomSelect
            id="location"
            label="LOCATION*"
            containerClass="w-full"
            className="w-full"
            onChange={v => setFieldValue('location', v)}
            placeholder={"Select a Payment Method"}
            options={PAYMENT_METHODS}
          /> */}

          <Input
            id="location"
            label="LOCATION*"
            onBlur={handleBlur}
            onChange={handleChange}
            containerClass="w-full"
            placeholder={"Enter Customer Location"}
            value={values.location}
            error={errors.location}
            touched={touched.location}
          />


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
          {/* {JSON.stringify(errors)} */}
          <DialogFooter className="justify-start!">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isValid}>
              Add Customer
            </Button>
            <DialogClose asChild className="hidden">
              <Button variant="outline" ref={closeRef}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
