"use client"
import { mainClient } from '@/lib/axios';
import { API_ENDPOINTS, TODO_IDS, type TODO_TYPE } from '@/lib/constants';
import { PATHS } from '@/lib/constants/paths';
import { useBusinessDataStore } from '@/lib/stores/business';
import { useChecklistStore } from '@/lib/stores/checklist';
import { useIntegrationsStore } from '@/lib/stores/integrations';
import { CheckCircle, ChevronDown, ChevronUp, Circle, Target } from 'lucide-react';
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

export default function DashboardChecklistModal() {
    const navigate = useNavigate()
    const {
        todos,
        setTodos,
        isChecklistMinimized,
        setIsChecklistMinimized
    } = useChecklistStore()
    const { businessData } = useBusinessDataStore()
    const { integrations, setIntegrations } = useIntegrationsStore()


    const tasks = [
        { id: TODO_IDS.IMPORT_PRODUCTS, title: "Import products from files", subtitle: "Or just them manually" },
        { id: TODO_IDS.IMPORT_CUSTOMERS, title: "Import customer data from files", subtitle: "Or just them manually" },
        { id: TODO_IDS.IMPORT_SALES, title: "Import sales from files", subtitle: "Or just them manually" },
        { id: TODO_IDS.IMPORT_SHOPIFY_DATA, title: "Import your data from shopify", subtitle: "This includes customer, orders, and products" },
    ];
    const {
        completedTasks,
        totalTasks,
        progressPercentage
    } = useMemo(() => {
        const completedTodos = tasks.filter(task => todos.includes(task.id))
        const completedTasks = completedTodos.length;
        const totalTasks = tasks.length;
        const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
        return {
            completedTodos,
            completedTasks,
            totalTasks,
            progressPercentage
        }
    }, [])

    const handleTaskClick = async (todoId: TODO_TYPE) => {
        if (todoId === 'IMPORT_PRODUCTS') {
            navigate(PATHS.INVENTORY);
            return
        }
        if (todoId === 'IMPORT_CUSTOMERS') {
            navigate(PATHS.CUSTOMERS);
            return
        }
        if (todoId === 'IMPORT_SALES') {
            navigate(PATHS.SALES);
            return
        }
        if (todoId === 'IMPORT_SHOPIFY_DATA') {
            navigate(`${PATHS.SETTINGS}?tab=integrations`);
            return;
        }
    };


    const verifyShopifyIntegration = async () => {
        try {
            const res = await mainClient.get(API_ENDPOINTS.Shopify.VerfiySession)
            if (res.status === 200) {
                if (res.data.result.integrated) {
                    setIntegrations({ shopify: true })
                }
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        verifyShopifyIntegration()
        setTodos([
            ...todos,
            (businessData?.products.length ? TODO_IDS.IMPORT_PRODUCTS : ''),
            (businessData?.customers.length ? TODO_IDS.IMPORT_CUSTOMERS : ''),
            (businessData?.sales.length ? TODO_IDS.IMPORT_SALES : ''),
            (integrations.shopify && (
                businessData?.products.length ||
                businessData?.customers.length ||
                businessData?.sales.length
            ) ? TODO_IDS.IMPORT_SHOPIFY_DATA : '')

        ].filter(v => !!v))

    }, [businessData, integrations.shopify])

    if (isChecklistMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsChecklistMinimized(false)}
                    className="bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2"
                >
                    <Target size={16} />
                    <span className="text-sm font-medium">{completedTasks}/{totalTasks} Complete</span>
                    <ChevronUp size={16} />
                </button>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-60 pointer-events-none">
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/20 pointer-events-auto"
                    onClick={() => setIsChecklistMinimized(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                />

                {/* Modal */}
                <motion.div
                    className="absolute bottom-0 w-full pointer-events-auto sm:bottom-4 sm:right-4 sm:w-full sm:max-w-md"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}

                >
                    <div className="bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 sm:rounded-2xl sm:mb-0">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Target className="text-primary" size={24} />
                                    <h3 className="text-lg font-semibold text-gray-900">Onboarding Checklist</h3>
                                </div>
                                <button
                                    onClick={() => setIsChecklistMinimized(true)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <ChevronDown size={20} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{completedTasks} of {totalTasks} Complete</span>
                                    <span className="font-medium text-primary">{progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="bg-primary h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="px-6 py-4 max-h-80 overflow-y-auto">
                            <div className="space-y-1-">
                                {tasks.map((task) => {
                                    let completed = todos.includes(task.id)
                                    return (
                                        <button
                                            key={task.id}
                                            disabled={completed}
                                            onClick={() => handleTaskClick(task.id)}
                                            className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                                        >
                                            {completed ? (
                                                <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={20} />
                                            ) : (
                                                <Circle className="cursor-pointer text-gray-300 mt-0.5 shrink-0 group-hover:text-primary-light" size={20} />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${completed ? 'text-gray-600 line-through' : 'text-gray-900'
                                                    }`}>
                                                    {task.title}
                                                </p>
                                                {task?.subtitle && (
                                                    <p className="text-xs text-primary">{task.subtitle}</p>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-gray-50 rounded-b-2xl">
                            <p className="text-xs text-gray-500 text-center">
                                👆 Tap any item to jump there
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
