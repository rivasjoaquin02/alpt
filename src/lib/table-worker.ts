import { workerData, parentPort } from "worker_threads"
import { tables } from "../tables/tables"

const tableName: string = workerData.table
const table = tables.get(tableName)

const result = await table.generateValue()
parentPort?.postMessage(result)
