import type { BackgroundTask } from "@/types";
import { mainClient } from "./axios";
import { API_ENDPOINTS } from "./constants";

export const pollSleep = (ms: number, signal?: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, ms);

        if (!signal) return;

        const onAbort = () => {
            clearTimeout(t);
            reject(new DOMException("Aborted", "AbortError"));
        };

        if (signal.aborted) return onAbort();
        signal.addEventListener("abort", onAbort, { once: true });
    });

const pollTask = async (taskId: string) => {
    const res = await mainClient.get(API_ENDPOINTS.Tasks.ById(taskId))
    const task: BackgroundTask = res.data.result
    return task
}


export const waitForTaskCompletion = async ({
    taskId,
    intervalMs = 2000,
    timeoutMs = 10 * 60 * 1000,
    signal,
}: {
    taskId: string;
    intervalMs?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
}) => {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

        const { status } = await pollTask(taskId);

        if (status === "completed") return true;

        await pollSleep(intervalMs, signal);
    }

    throw new Error("Timed out waiting for import to complete");
};


// const pollTask = async (taskId: string) => {
//     const res = await mainClient.get(API_ENDPOINTS.Tasks.ById(taskId))
//     const task: BackgroundTask = res.data.result
//     return task.status === 'completed'
// }

// const importShopifyData = async () => {
//     setLoading(true)
//     try {
//         const res = await mainClient.get(API_ENDPOINTS.Shopify.ImportBg)

//         if (res.status === 200) {
//             if (res.data.result.status === 'queued') {
//                 console.log("loading", loading)
//                 while (true) {
//                     await new Promise((resolve) => setTimeout(() => resolve(true), 2000))
//                     const status = await pollTask(res.data.result.taskId)
//                     if (status) {
//                         setLoading(false)
//                         toast.success(res.data.message)
//                         break;
//                     }
//                 }
//             } else {
//                 toast.error(ERROR_MESSAGES.ServerError)
//             }
//         } else {
//             toast.error(res.data.message)
//         }
//     } catch (error) {
//         if (isAxiosError(error)) {
//             toast.error(error.response?.data.message)
//         }
//         setLoading(false)
//     }
// }
