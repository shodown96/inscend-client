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
import { API_ENDPOINTS } from "@/lib/constants"
import { useCustomerStore } from "@/lib/stores/customer"
import { CustomerParamsSchema, type CustomerParamsType } from "@/lib/validations/customer"
import { useFormik } from "formik"
import { Plus } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

export function CustomersModal() {
  const closeRef = useRef<any>(null)
  const { setCustomers } = useCustomerStore()

  const formik = useFormik<CustomerParamsType>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      notes: "",
    },
    onSubmit: async (values) => {
      const result = await mainClient.post(API_ENDPOINTS.Customers.Base, {
        ...values,
        email: values.email.toLowerCase()
      })
      if (result.status === 201) {
        toast.success(result.data.message);
        await mainClient.get(API_ENDPOINTS.Customers.Base)
          .then(r => {
            setCustomers(r.data.result.items)
          })
        closeRef.current?.click()
        formik.resetForm()
      }
    },
    validateOnBlur: true,
    isInitialValid: false,
    validationSchema: CustomerParamsSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    // setFieldValue,
    values,
    errors,
    touched,
    isSubmitting,
    isValid
  } = formik;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Add a new customer
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
