import {
  Server,
  ServerCredentials,
  ServerUnaryCall,
  sendUnaryData,
} from "@grpc/grpc-js";

import { WalletService } from "@/protos/wallet_grpc_pb";
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

const walletInfo = async (
  call: ServerUnaryCall<WalletInfoRequest, WalletInfoRequest>,
  callback: sendUnaryData<WalletInfoResponse>
) => {
  const address = call.request.getAddress();
  try {
    const walleTransactions = [
      {
        fromAddres: "0x0987654321",
        toAddress: "0x1234567890",
        value: 10,
        date: Date.now().toString(),
      },
      {
        fromAddres: "0x1234567890",
        toAddress: "0x0987654321",
        value: 20,
        date: Date.now().toString(),
      },
    ].map((transaction) => {
      const transactionReply = new Transaction();
      transactionReply.setToAddress(transaction.toAddress);
      transactionReply.setValue(transaction.value);
      transactionReply.setDate(transaction.date);

      return transactionReply;
    });

    const walletReply = new WalletInfoResponse();
    walletReply.setTotal(100);
    walletReply.setAvailable(80);
    walletReply.setTransactionsList(walleTransactions);

    callback(null, walletReply);
  } catch (err) {
    callback(err, null);
  }
};

const balance = (
  call: ServerUnaryCall<BalanceRequest, BalanceResponse>,
  callback: sendUnaryData<BalanceResponse>
) => {
  // Perform necessary business logic
  const total = 100;
  const available = 50;
  const balanceResponse = new BalanceResponse();
  balanceResponse.setTotal(total);
  balanceResponse.setAvailable(available);
  callback(null, balanceResponse);
};

const transaction = (
  call: ServerUnaryCall<TransactionRequest, TransactionResponse>,
  callback: sendUnaryData<TransactionResponse>
) => {
  const transactionId = Date.now();
  const transactionResponse = new TransactionResponse();
  transactionResponse.setTransactionId(transactionId);
  callback(null, transactionResponse);
};

const createAddress = (
  call: ServerUnaryCall<CreateAddressRequest, CreateAddressResponse>,
  callback: sendUnaryData<CreateAddressResponse>
) => {
  const address = "0x1234567890abcdef";
  const createAddressResponse = new CreateAddressResponse();
  createAddressResponse.setAddress(address);
  callback(null, createAddressResponse);
};

const server = new Server();
server.addService(WalletService, {
  createAddress,
  transaction,
  balance,
  walletInfo,
});
server.bindAsync(
  "localhost:50051",
  ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);

    console.log(`Wallet MS running on port ${port}`);
    server.start();
  }
);
