import { workerData, parentPort } from "worker_threads"

function fib(n: number): number {
    return n < 2
        ? 1
        : fib(n - 2) + fib(n - 1)
}

const result = fib(workerData.n)
const sum = workerData.sum(3, 4)
parentPort?.postMessage({ result, sum })
