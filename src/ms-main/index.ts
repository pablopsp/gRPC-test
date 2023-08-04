import express, { Request, Response, json } from "express";
import { ServiceError, credentials } from "@grpc/grpc-js";

import { WalletClient } from "@/protos/wallet_grpc_pb";
import {
  BalanceRequest,
  BalanceResponse,
  CreateAddressRequest,
  CreateAddressResponse,
  Transaction,
  TransactionRequest,
  TransactionResponse,
  WalletInfoRequest,
  WalletInfoResponse,
} from "@/protos/wallet_pb";

const walletClient = new WalletClient(
  "localhost:50051",
  credentials.createInsecure()
);

const app = express();
app.use(json());

app.get("/address/create", (req: Request, res: Response) => {
  walletClient.createAddress(
    new CreateAddressRequest(),
    (err: ServiceError, resp: CreateAddressResponse) => {
      const address = resp.toObject();
      res.json(address);
    }
  );
});

app.get("/address/:addressId/balance", (req: Request, res: Response) => {
  const balanceRequest = new BalanceRequest();
  balanceRequest.setAddress(req.params.addressId);

  walletClient.balance(
    balanceRequest,
    (err: ServiceError, resp: BalanceResponse) => {
      const balance = resp.toObject();
      res.json(balance);
    }
  );
});

app.get("/address/:addressId/wallet-info", (req: Request, res: Response) => {
  const walletInfoRequest = new WalletInfoRequest();
  walletInfoRequest.setAddress(req.params.addressId);

  walletClient.walletInfo(
    walletInfoRequest,
    (err: ServiceError, resp: WalletInfoResponse) => {
      const info = resp.toObject();
      res.json(info);
    }
  );
});

app.post(
  "/address/:addressFrom/transaction/:addressTo",
  (req: Request, res: Response) => {
    const transactionRequest = new TransactionRequest();
    const transaction = new Transaction();

    transaction.setFromAddress(req.params.addressFrom);
    transaction.setToAddress(req.params.addressTo);
    transaction.setValue(req.body.value);
    transaction.setDate(new Date().toUTCString());

    transactionRequest.setTransaction(transaction);

    walletClient.transaction(
      transactionRequest,
      (err: ServiceError, resp: TransactionResponse) => {
        const info = resp.toObject();
        res.json(info);
      }
    );
  }
);

const port = 5000;
app.listen(port, () => {
  console.log(`RESTful API is listening on port ${port}`);
});
