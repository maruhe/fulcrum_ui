import fetchPonyfill from "fetch-ponyfill";
import Web3 from "web3";
import { JsonRpcPayload } from "web3-providers";
import { JsonRPCRequest, JsonRPCResponse } from "web3/providers";

const { fetch, Headers } = fetchPonyfill();

export interface AlchemyWeb3 extends Web3 {
  alchemy: AlchemyMethods;
}

export interface AlchemyMethods {
  getTokenBalances(
    address: string,
    contractAddresses: string[],
    callback?: Web3Callback<TokenBalancesResponse>,
  ): Promise<TokenBalancesResponse>;
}

export interface TokenBalancesResponse {
  address: string;
  tokenBalances: TokenBalance[];
}

export type TokenBalance = TokenBalanceSuccess | TokenBalanceFailure;

export interface TokenBalanceSuccess {
  address: string;
  tokenBalance: string;
  error: null;
}

export interface TokenBalanceFailure {
  address: string;
  tokenBalance: null;
  error: string;
}

export type Web3Callback<T> = (error: Error | null, result?: T) => void;

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare const window: EthereumWindow;

const ALCHEMY_DISALLOWED_METHODS: string[] = [
  "eth_accounts",
  "eth_sendRawTransaction",
  "eth_sendTransaction",
  "eth_sign",
  "eth_signTypedData_v3",
  "eth_signTypedData",
  "personal_sign",
];

const ALCHEMY_HEADERS = new Headers({
  Accept: "application/json",
  "Content-Type": "application/json",
});

export function createAlchemyWeb3(alchemyUrl: string): AlchemyWeb3 {
  function sendAsync(
    payload: JsonRpcPayload,
    callback: Web3Callback<JsonRPCResponse>,
  ): void {
    callWhenDone(promisedSend(payload, alchemyUrl), callback);
  }
  const alchemyWeb3 = new Web3({ sendAsync } as any) as AlchemyWeb3;
  alchemyWeb3.alchemy = {
    getTokenBalances: (address, contractAddresses, callback) =>
      callAlchemyMethod(
        "alchemy_getTokenBalances",
        [address, contractAddresses],
        alchemyUrl,
        callback,
      ),
  };
  return alchemyWeb3;
}

async function promisedSend(
  payload: JsonRpcPayload,
  alchemyUrl: string,
): Promise<JsonRPCResponse> {
  if (ALCHEMY_DISALLOWED_METHODS.indexOf(payload.method) === -1) {
    try {
      return await sendToAlchemy(payload, alchemyUrl);
    } catch (alchemyError) {
      // Fallback to Metamask, but if both fail throw the error from Alchemy.
      try {
        return await sendToMetamaskProvider(payload);
      } catch {
        throw alchemyError;
      }
    }
  } else {
    return sendToMetamaskProvider(payload);
  }
}

async function sendToAlchemy(
  payload: JsonRpcPayload,
  alchemyUrl: string,
): Promise<JsonRPCResponse> {
  const response = await fetch(alchemyUrl, {
    method: "POST",
    headers: ALCHEMY_HEADERS,
    body: JSON.stringify(payload),
  });
  return response.json();
}

function sendToMetamaskProvider(
  payload: JsonRpcPayload,
): Promise<JsonRPCResponse> {
  const provider = typeof window !== "undefined" ? window.ethereum : undefined;
  if (!provider) {
    return Promise.reject(
      `No Ethereum provider found for method "${payload.method}"`,
    );
  }
  return promiseFromCallback(callback => provider.sendAsync(payload, callback));
}

function callAlchemyMethod<T>(
  method: string,
  params: any[],
  alchemyUrl: string,
  callback: Web3Callback<T> = noop,
): Promise<T> {
  const promise = (async () => {
    const payload: JsonRPCRequest = { method, params, jsonrpc: "2.0", id: 0 };
    const { error, result } = await sendToAlchemy(payload, alchemyUrl);
    if (error != null) {
      throw new Error(error);
    }
    return result;
  })();
  callWhenDone(promise, callback);
  return promise;
}

/**
 * Helper for converting functions which take a callback as their final argument
 * to functions which return a promise.
 */
function promiseFromCallback<T>(
  f: (callback: Web3Callback<T>) => void,
): Promise<T> {
  return new Promise((resolve, reject) =>
    f((error, result) => {
      if (error != null) {
        reject(error);
      } else {
        resolve(result);
      }
    }),
  );
}

/**
 * Helper for converting functions which return a promise to functions which
 * take a callback as their final argument.
 */
function callWhenDone<T>(promise: Promise<T>, callback: Web3Callback<T>): void {
  promise.then(result => callback(null, result), error => callback(error));
}

function noop(): void {
  // Nothing.
}
