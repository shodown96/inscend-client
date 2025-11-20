import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { mainClient, multipartClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants"
import { useAuthStore } from "@/lib/stores/auth"
import { useCustomerStore } from "@/lib/stores/customer"
import { useProductStore } from "@/lib/stores/product"
import { useSalesStore } from "@/lib/stores/sale"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function ImportModal({ type }: { type: 'Sales' | 'Customers' | 'Products' }) {
  const { user } = useAuthStore()
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(() => {
    const saved = sessionStorage.getItem(`${type}-upload-progress`)
    return saved ? parseInt(saved, 10) : 0
  })
  const [uploading, setUploading] = useState(false)

  const { setProducts } = useProductStore()
  const { setCustomers } = useCustomerStore()
  const { setSales } = useSalesStore()


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadProgress(0)
    }
  }

  // const downloadTemplate = () => {
  //   const link = document.createElement("a")
  //   link.href = `/templates/${type.toLowerCase()}-template.pdf`
  //   link.download = `${type}-Template.pdf`
  //   link.click()
  // }

  const handleSubmitV1 = async () => {
    if (!selectedFile) return toast.error("Please select a file first.")
    setUploading(true)

    const values = new FormData()
    values.append("file", selectedFile)

    try {
      const result = await multipartClient.post(API_ENDPOINTS?.[type].Import, values, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percent)
        },
      })

      if (result.status === 200) {
        toast.success(result.data.message)
        const response = await mainClient.get(API_ENDPOINTS?.[type].Base)

        if (type === 'Products') setProducts(response.data.result.items)
        if (type === 'Customers') setCustomers(response.data.result.items)
        if (type === 'Sales') setSales(response.data.result.items)

        setUploading(false)
        setSelectedFile(null)
        setUploadProgress(100)
        sessionStorage.removeItem(`${type}-upload-progress`)
        closeRef.current?.click()
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Upload failed.")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async () => {
    if (false) { handleSubmitV1() }
    if (!selectedFile) return toast.error("Please select a file first.")
    setUploading(true)

    const values = new FormData()
    values.append("file", selectedFile)

    try {
      let path = "csv/extract"
      if (selectedFile.type.includes("image")) {
        path = "image/extract"
      }
      if (selectedFile.type.includes("pdf")) {
        path = "image/extract-pdf"
      }
      const result = await multipartClient.post(`https://ai-dev.inscend.io/${path}`, values, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percent)
        },
        withCredentials: false
      })

      if (result.status === 200) {
        const extractedData = result.data.data
        console.log(extractedData)
        toast.success(result.data.message)
        const mappedResult = await mainClient.post(API_ENDPOINTS?.[type].AddImported,
          extractedData.map((v: any) => ({ ...v, businessId: user?.businessId })))
        if (mappedResult.status === 200) {
          const response = await mainClient.get(API_ENDPOINTS?.[type].Base)

          if (type === 'Products') setProducts(response.data.result.items)
          if (type === 'Customers') setCustomers(response.data.result.items)
          if (type === 'Sales') setSales(response.data.result.items)

          setUploading(false)
          setSelectedFile(null)
          setUploadProgress(100)
          sessionStorage.removeItem(`${type}-upload-progress`)
          closeRef.current?.click()
        }
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Upload failed.")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Persist progress across reloads
  useEffect(() => {
    sessionStorage.setItem(`${type}-upload-progress`, String(uploadProgress))
  }, [uploadProgress, type])

  // useEffect(() => {
  //   if (selectedFile) {
  //     handleSubmit()
  //   }
  // }, [selectedFile])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import {type.slice(0, type.length - 1)}
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>File Upload & Data Extraction</DialogTitle>
          <DialogDescription>
            Import {type.toLowerCase()} data via structured files.
          </DialogDescription>
        </DialogHeader>

        {/* File Input */}
        <div className="mb-6">
          <div
            className={cn(
              "w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50/50 transition",
              uploading ? 'bg-primary/30' : ''
            )}
            onClick={() => inputRef.current?.click()}
          >
            {!selectedFile ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-6 h-6 text-gray-500" />
                <p className="text-gray-600 font-medium">Click to upload or drag file here</p>
                <p className="text-xs text-gray-400">PDF or CSV (max 10MB)</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="bg-[#0B3D3D] text-white text-xs font-bold px-2 py-1 rounded-md">
                  {selectedFile.type.includes("pdf") ? "PDF" : "CSV"}
                </div>
                <p className="text-gray-700 font-medium">{uploadProgress}%</p>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[#0B3D3D] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {uploading ? "Uploading…" : "Ready to upload"}
                  <span className="block text-xs text-gray-400">{selectedFile.name}</span>
                </p>
              </div>
            )}
          </div>
          <input
            id="file"
            type="file"
            accept=".pdf,.csv"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* Download Template */}
        {/* <div className="mb-6">
          <h3 className="text-gray-700 font-semibold text-sm mb-1">Download Template</h3>
          <p className="text-sm text-gray-500 mb-3">Use this template for consistent data import.</p>

          <div
            className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={downloadTemplate}
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">PDF</div>
              <div>
                <p className="text-sm text-gray-800 font-medium">Data Structure Template</p>
                <p className="text-xs text-gray-500">~13MB</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-600" />
          </div>
        </div> */}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => closeRef.current?.click()}
            ref={closeRef}
          >
            Cancel
          </Button>
          <Button
            loading={uploading}
            disabled={!selectedFile || uploading}
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
