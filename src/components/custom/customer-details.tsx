import type { Customer } from "@/types/customer";
import type { Sale } from "@/types/sales";
import { format, formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import EmptySalesIcon from "@/assets/icons/empty-sales.svg?react";

// Status Pill Component
const StatusPill = ({ status }: { status: string }) => {
    const isCompleted = status.toLowerCase() === 'completed';

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
                }`}
        >
            {status}
        </span>
    );
};

// Loyalty Badge Component
const LoyaltyBadge = ({ tier }: { tier: string }) => {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
            {tier}
        </span>
    );
};

// Profile Card Component
const ProfileCard = ({ customer, sales }: { customer: Customer; sales: Sale[] }) => {
    const lastSeen = sales.length > 0
        ? formatDistanceToNow(new Date(sales[0].createdAt), { addSuffix: true })
        : 'Never';

    const loyaltyTier = sales.length >= 10 ? 'VIP' : sales.length >= 5 ? 'Gold' : 'Regular';

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="flex items-start justify-between border-b p-3">
                <h2 className="font-semibold text-gray-900">Profile</h2>
                <MoreVertical className="text-gray-400 hover:text-gray-600" />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Avatar and Contact Info */}
                <div className="flex flex-col items-center md:items-start p-5">
                    {customer.avatar?.url ? (
                        <img
                            src={customer.avatar.url}
                            alt={customer.name}
                            className="size-16 rounded-full object-cover mb-4"
                        />
                    ) : (
                        <div className="size-16 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-3xl">
                                {customer.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{customer.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{customer.phone || 'No phone'}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                </div>

                {/* Customer Details */}
                <div className="flex-1 border-l border-gray-200 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Customer since:</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Last seen:</p>
                            <p className="text-sm font-semibold text-gray-900">{lastSeen}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Loyalty</p>
                            <LoyaltyBadge tier={loyaltyTier} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Location</p>
                            <p className="text-base font-semibold text-gray-900">{customer.location}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Button>
                            Send Whatsapp
                        </Button>
                        <Button variant={'outline'}>
                            Send Mail
                        </Button>
                        <Button variant={'outline'}>
                            Send SMS
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Overview Stats Component
const OverviewStats = ({ sales }: { sales: Sale[] }) => {
    const totalSpent = sales.reduce((sum, sale) => sum + (sale.quantity * sale.unitPrice), 0);
    const completedSales = sales.filter(s => s.createdAt).length;
    const completionRate = sales.length > 0 ? Math.round((completedSales / sales.length) * 100) : 0;

    return (
        <div className="bg-white rounded-lg shadow lg:h-full">
            <div className="flex items-start justify-between border-b p-3">
                <h2 className="font-semibold text-gray-900">Overview</h2>
                <MoreVertical className="text-gray-400 hover:text-gray-600" />
            </div>

            <div className="flex justify-between items-center px-10 w-full pt-14">

                <div>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                        ${totalSpent.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                        ${totalSpent.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Lifetime spend</p>
                </div>
                <div>
                    <p className="text-xl font-bold text-gray-900 mb-1">{completionRate}%</p>
                    <p className="text-sm text-gray-600">Completed</p>
                </div>

            </div>
        </div>
    );
};

// Purchase History Component
const PurchaseHistory = ({ sales }: { sales: Sale[] }) => {
    const formatOrderId = (id: string) => {
        return `#c${id.slice(-4)}`;
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Purchase History</h2>
                {sales.length ? (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        See All
                    </button>
                ) : null}
            </div>
            {sales.length ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Order ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Purchse Date
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                        {formatOrderId(sale.id)}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {sale.product?.name || 'Unknown Product'}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        ${(sale.quantity * sale.unitPrice).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusPill status="Completed" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {format(new Date(sale.createdAt), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-4 py-4">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded p-3 py-10 flex flex-col gap-4 justify-center items-center text-center mb-4">
                    <EmptySalesIcon />
                    <div>This customer hasn't made any purchases yet</div>

                </div>
            )}

        </div>
    );
};

// Purchase Behavior Component
const PurchaseBehavior = () => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Purchase Behavior</h2>
                <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>

            <div className="space-y-6">
                {/* Buying Pattern */}
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Buying Pattern</h3>
                            <p className="text-sm text-gray-600">Regular</p>
                        </div>
                        <div className="flex items-center text-green-600">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span className="text-sm">every 35-40 days</span>
                        </div>
                    </div>
                </div>

                {/* Shopping Days */}
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Shopping Days</h3>
                            <p className="text-sm text-gray-600">Weekends</p>
                        </div>
                        <div className="flex items-center text-red-600">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span className="text-sm">Sat-Sun</span>
                        </div>
                    </div>
                </div>

                {/* Probability Section */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-center flex-1">
                            <p className="text-4xl font-bold text-gray-900 mb-1">68%</p>
                            <p className="text-sm text-gray-600">Probability</p>
                        </div>
                        <div className="text-right flex-1">
                            <p className="text-sm text-gray-600 mb-1">Next expected purchase:</p>
                            <p className="text-base font-semibold text-gray-900">Oct 12-17, 2025</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <Button >
                            Set Reminder
                        </Button>
                        <Button variant={'outline'} >
                            Send Promo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Customer View Component
export const CustomerView = ({ customer, sales }: { customer: Customer; sales: Sale[] }) => {
    return (
        <div className="max-w-7xl space-y-6">
            {/* Top Row: Profile and Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ProfileCard customer={customer} sales={sales} />
                </div>
                <div>
                    <OverviewStats sales={sales} />
                </div>
            </div>

            {/* Bottom Row: Purchase History and Behavior */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PurchaseHistory sales={sales} />
                </div>
                <div>
                    <PurchaseBehavior />
                </div>
            </div>
        </div>
    );
};