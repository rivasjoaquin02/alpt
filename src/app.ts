import { tables } from "./tables/tables";

const amount = Number(process.argv[2]) || 0

if (amount > 0) {
    const table = tables.get("library")
    //console.log(await table.generateValue())
    table.insertData(amount)
}

