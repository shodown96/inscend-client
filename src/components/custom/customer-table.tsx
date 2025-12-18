import { PATHS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { Customer } from "@/types/customer";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

// Customer Table Component
export const CustomerTable = ({ customers }: { customers: Customer[] }) => {
    const navigate = useNavigate()
    const handleViewCustomer = (customer: Customer) => {
        console.log('View customer:', customer);
        // Add your view logic here
        navigate(`${PATHS.CUSTOMERS}/${customer.id}`)
    };

    return (
        <div className="w-full bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-200">
                {customers.map((customer) => (
                    <div
                        key={customer.id}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-4 flex-1">
                            {/* Checkbox */}
                            <Checkbox className="rounded" />

                            {/* Avatar and Customer Info */}
                            <div className="flex items-center space-x-3">
                                {customer.avatar ? (
                                    <img
                                        src={customer.avatar.url}
                                        alt={customer.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium text-lg">
                                            {getInitials(customer.name)}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <div className="text-base font-medium text-gray-900">
                                        {customer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {customer.id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View Button */}
                        <Button
                            variant="outline"
                            onClick={() => handleViewCustomer(customer)}
                            className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                            View
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
