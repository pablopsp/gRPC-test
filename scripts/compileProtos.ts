import { exec } from "child_process";
import { resolve, join, basename } from "path";
import { existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";

let cwd = process.cwd();
const compiledProtosFolder = resolve(cwd, "src/protos");

if (!existsSync(compiledProtosFolder)) {
  console.log("Creating compiled protos folder..");
  mkdirSync(compiledProtosFolder);
} else {
  console.log("Cleaning compiled protos folder..");
  readdirSync(compiledProtosFolder).forEach((file) =>
    unlinkSync(join(compiledProtosFolder, file))
  );
}

// Need to execute the parseProtoscommand in the folder where the protos are
process.chdir("protos");
cwd = process.cwd();

console.log("Compiling .proto files..");
readdirSync(cwd).map((file) => {
  if (file.endsWith(".proto")) {
    const fileName = basename(file);

    const parseProtoscommand = `grpc_tools_node_protoc \
        --js_out=import_style=commonjs,binary:${compiledProtosFolder} \
        --ts_out=${compiledProtosFolder} \
        --grpc_out=${compiledProtosFolder} \
        ${fileName}`;

    exec(parseProtoscommand, (error) => {
      if (error) {
        console.error(`Error compiling ${file}:`, error.message);
        return;
      }
      console.log(`${file} compiled successfully.`);
    });
  }
});
