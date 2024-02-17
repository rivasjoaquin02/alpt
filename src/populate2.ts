import { getDocument } from "./generators/document2"

const AMOUNT = Number(process.argv[2]) || 0
const CHUNK_SIZE = 10_000


function seedDocument(): void {
    const data = []

    for (let i = 0; i < AMOUNT; i++) {
        const value = getDocument()
        data.push(value)
    }
     
    console.log(`documents: Generated ${data.length}`)
}
