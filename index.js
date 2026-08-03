import { readFile, readFileSync, writeFile, writeFileSync } from "fs";
import { createServer } from "http";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ================= FIES ================//

// Blocking Synchronous way
// const textIn = readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about: ${textIn}.\nCreated on ${Date.now()}`;
// writeFileSync("./txt/output.txt", textOut);

// console.log("File Written !!!!!!!!!");

// Non-Blocking Asynchronous way
// readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       writeFile("./txt/final.txt",`${data2}\n${data3}`,"utf-8", (err) => {
//         console.log("file has written!!!!!!!")
//       })
//     });
//   });
// });
// console.log("hellppppppppppppp");
// ================= SERVER ================//

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const tempOverview = readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8",
);

const tempProduct = readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8",
);

const tempCard = readFileSync(`${__dirname}/templates/card.html`, "utf-8");

const data = readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = createServer((req, res) => {
  const { pathname, searchParams } = new URL(
    req.url,
    `http://${req.headers.host}`,
  );
  const query = Object.fromEntries(searchParams);

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const overviewOutput = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(overviewOutput);

    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });

    const product = dataObj[query.id];
    const productOutput = replaceTemplate(tempProduct, product);

    res.end(productOutput);

    // api page
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);

    // not found page
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page Not Founded!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to REquests on port 8000 !!!!!");
});
