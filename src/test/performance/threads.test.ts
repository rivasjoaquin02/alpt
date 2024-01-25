import type { library } from "../../../drizzle/schema";
import { Worker } from "worker_threads"

const THREAD_COUNT = 4
const amount = Number(process.argv[2]) | 0
const amount_per_thread = Math.round(amount / THREAD_COUNT)

type Library = typeof library.$inferInsert
const getLibrary = (): Promise<Library> => new Promise((resolve, reject) => {
    const worker = new Worker("./worker.ts", { workerData: { amount: amount_per_thread } })
    worker.once("message", resolve);
    worker.once("error", reject);
})

const promisesArray = Array.from({ length: THREAD_COUNT }, getLibrary)
const results = await Promise.all(promisesArray)

console.log("done")

