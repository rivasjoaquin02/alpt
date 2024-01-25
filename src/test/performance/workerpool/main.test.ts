import workerpool from "workerpool"

const pool = workerpool.pool("./worker.ts")


const amount = Number(process.argv[2]) | 0

for (let i = 0; i < amount; i++) {
    pool
        .proxy()
        .then(worker => worker.getLibrary)
        .then(console.log)
        .then(console.error)
}


