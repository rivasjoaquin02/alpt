import { Worker } from "worker_threads"


const sum = (a: number, b: number) => a + b

const doFib = (n: number) => new Promise((res, rej) => {
    const tick = performance.now()
    const worker = new Worker("worker.ts", {
        workerData: { n, sum }
    })
    worker.once("message", (data) => {
        console.log(`worker [${worker.threadId}]: done in ${performance.now() - tick}ms`)
        console.log(data.sum)
        res(data)
    })

    worker.once("error", (err) => rej(err))
})


async function main() {

    const tick = performance.now()
    const values = await Promise.all([
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),

        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
        doFib(40),
    ])
    console.log(values)
    console.log(`Total Time: ${performance.now() - tick}ms`)
}

await main()

