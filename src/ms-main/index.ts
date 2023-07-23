import express, { json } from "express";
import { credentials } from "@grpc/grpc-js";

import { WalletClient } from "@/protos/wallet_grpc_pb";
import { CreateAddressRequest } from "@/protos/wallet_pb";

const walletClient = new WalletClient(
  "localhost:50051",
  credentials.createInsecure()
);

const app = express();
app.use(json());

app.get("/address", (req, res) => {
  walletClient.createAddress(new CreateAddressRequest(), (err, resp) => {
    res.send(resp.getAddress());
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`RESTful API is listening on port ${port}`);
});
