import { faker } from "@faker-js/faker";
import { getDocument, getDocument2 } from "../../generators/document";

/* let start = performance.now()
for (let i = 0; i < 10000; i++) getDocument({ faker });
console.log("first: ", performance.now() - start)

start = performance.now()
for (let i = 0; i < 10000; i++) getDocument2()
console.log("second: ", performance.now() - start) */

console.log(getDocument2())
