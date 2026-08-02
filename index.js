import { readFile, readFileSync, writeFile, writeFileSync } from "fs";
import { createServer } from "http";

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

const server = createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This Is Overview!!!!!");
  } else if (pathName === "/product") {
    res.end("This Is Product!!!!!");
  } else if (pathName === "/api") {
    readFile("./dev-data/data.json","utf-8");
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
