import { useActionBoardStore } from "@/lib/stores/action-board";
import type { ActionCard } from "@/types/action-board";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { PATHS } from "@/lib/constants";

export default function ActionCardItem({ item }: { item: ActionCard }) {
  const { affectedProducts } = useActionBoardStore()
  const navigate = useNavigate()

  const handleAction = () => {
    if (item.type === 'customer_reminder') {
      navigate(PATHS.CUSTOMERS)
    } else {
      navigate(PATHS.INVENTORY)
    }
  }
  return (
    <div className="w-full rounded-2xl border p-5 shadow-sm bg-white space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text- font-semibold text-gray-900 mt-1">
          {item.title}
        </h2>

        <span
          className={`
            text-xs px-3 py-1 rounded-full font-medium uppercase
            ${item.priority === "high"
              ? "bg-red-100 text-red-600"
              : item.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }
          `}
        >
          {item.priority}
        </span>
      </div>

      {/* Primary Metric */}
      <div className="flex items-center justify-between border rounded-xl p-3 bg-gray-50">
        <div>
          <p className="text-sm text-gray-500">{item.primary_metric.label}</p>
          <p className="text-xl font-bold text-gray-900">
            {item.primary_metric.currency}
            {item.primary_metric.value.toLocaleString()}
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Revenue at Risk:{" "}
          <span className="font-medium text-gray-800">
            {item.revenue_at_risk?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 
      <div className="flex items-center justify-between">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
          {item.action_label}
        </span>
        <div className="text-xs">
          <span className="font-medium">Confidence Score:</span>{" "}
          <span className="text-gray-700">{item.confidence_score}%</span>
        </div>
      </div> */}



      {/* Reasoning */}
      <div>
        {/* <p className="text-sm font-medium text-gray-800 mb-1">Why this matters</p> */}
        <p className="text-sm text-gray-600">{item.reasoning}</p>
      </div>

      <div className="flex items-center justify-between">
        {/* Entities */}
        <div>
          <p className="text-sm font-medium text-gray-800 mb-1">Products Affected</p>
          <div className="flex flex-wrap gap-2">
            {item?.entities?.product_ids?.map((id) => {
              const product = affectedProducts.find(v => v.id === id)
              // console.log(product, affectedProducts.length)
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700"
                >
                  {product?.name || id}
                </span>
              )
            }
            )}
          </div>
        </div>
        {/* Action button */}
        <Button size={'sm'} onClick={handleAction}>{item.action_label}</Button>
      </div>
    </div>
  );
}
