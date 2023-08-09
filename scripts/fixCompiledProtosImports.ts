import { glob } from "glob";
import { join, resolve } from "path";
import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";

const msFolders = glob.sync("ms-*");

msFolders.forEach((msFolder) => {
  const cwd = process.cwd();
  const compiledProtosFolder = resolve(cwd, `${msFolder}/src/protos`);

  console.log("Rewriting *_grpc_pb.d.ts grpc import");

  readdirSync(compiledProtosFolder).forEach((file) => {
    const filePath = join(compiledProtosFolder, file);

    if (statSync(filePath).isFile()) {
      if (/_grpc_pb\.d\.ts$/.test(file)) {
        const content = readFileSync(filePath, "utf8");
        const updatedContent = content.replace(
          /import \* as grpc from "grpc";/g,
          'import * as grpc from "@grpc/grpc-js";'
        );

        writeFileSync(filePath, updatedContent, "utf8");
        console.log(`Updated: ${filePath}`);
      }

      if (/_grpc_pb\.js$/.test(file)) {
        const content = readFileSync(filePath, "utf8");
        const updatedContent = content.replace(
          /var grpc = require\('grpc'\);/g,
          "var grpc = require('@grpc/grpc-js');"
        );

        writeFileSync(filePath, updatedContent, "utf8");
        console.log(`Updated: ${filePath}`);
      }
    }
  });
});
