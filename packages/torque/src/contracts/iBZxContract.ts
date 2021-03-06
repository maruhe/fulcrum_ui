// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import {
  BlockParam,
  CallData,
  ContractAbi,
  DecodedLogArgs,
  TxData,
  TxDataPayable,
  SupportedProvider
} from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class iBZxContract extends BaseContract {

  public paybackLoanAndClose = {
    async sendTransactionAsync(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      receiver: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("paybackLoanAndClose(bytes32,address,address,address,uint256)", [
        loanOrderHash,
        borrower,
        payer,
        receiver,
        closeAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).paybackLoanAndClose.estimateGasAsync.bind(self, loanOrderHash, borrower, payer, receiver, closeAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      receiver: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("paybackLoanAndClose(bytes32,address,address,address,uint256)", [
        loanOrderHash,
        borrower,
        payer,
        receiver,
        closeAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      receiver: string,
      closeAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "paybackLoanAndClose(bytes32,address,address,address,uint256)",
        [loanOrderHash, borrower, payer, receiver, closeAmount]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      receiver: string,
      closeAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("paybackLoanAndClose(bytes32,address,address,address,uint256)", [
        loanOrderHash,
        borrower,
        payer,
        receiver,
        closeAmount
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("paybackLoanAndClose(bytes32,address,address,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public extendLoanByInterest = {
    async sendTransactionAsync(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("extendLoanByInterest(bytes32,address,address,uint256,bool)", [
        loanOrderHash,
        borrower,
        payer,
        depositAmount,
        useCollateral
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).extendLoanByInterest.estimateGasAsync.bind(
          self,
          loanOrderHash,
          borrower,
          payer,
          depositAmount,
          useCollateral
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("extendLoanByInterest(bytes32,address,address,uint256,bool)", [
        loanOrderHash,
        borrower,
        payer,
        depositAmount,
        useCollateral
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      depositAmount: BigNumber,
      useCollateral: boolean
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "extendLoanByInterest(bytes32,address,address,uint256,bool)",
        [loanOrderHash, borrower, payer, depositAmount, useCollateral]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanOrderHash: string,
      borrower: string,
      payer: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("extendLoanByInterest(bytes32,address,address,uint256,bool)", [
        loanOrderHash,
        borrower,
        payer,
        depositAmount,
        useCollateral
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("extendLoanByInterest(bytes32,address,address,uint256,bool)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public getBasicLoansData = {
    async callAsync(
      borrower: string,
      count: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{
        loanOrderHash: string;
        loanTokenAddress: string;
        collateralTokenAddress: string;
        loanTokenAmountFilled: BigNumber;
        positionTokenAmountFilled: BigNumber;
        collateralTokenAmountFilled: BigNumber;
        interestOwedPerDay: BigNumber;
        interestDepositRemaining: BigNumber;
        initialMarginAmount: BigNumber;
        maintenanceMarginAmount: BigNumber;
        currentMarginAmount: BigNumber;
        maxDurationUnixTimestampSec: BigNumber;
        loanEndUnixTimestampSec: BigNumber;
      }>
    > {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("getBasicLoansData(address,uint256)", [borrower, count]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("getBasicLoansData(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{
          loanOrderHash: string;
          loanTokenAddress: string;
          collateralTokenAddress: string;
          loanTokenAmountFilled: BigNumber;
          positionTokenAmountFilled: BigNumber;
          collateralTokenAmountFilled: BigNumber;
          interestOwedPerDay: BigNumber;
          interestDepositRemaining: BigNumber;
          initialMarginAmount: BigNumber;
          maintenanceMarginAmount: BigNumber;
          currentMarginAmount: BigNumber;
          maxDurationUnixTimestampSec: BigNumber;
          loanEndUnixTimestampSec: BigNumber;
        }>
      >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public depositCollateral = {
    async sendTransactionAsync(
      loanOrderHash: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("depositCollateral(bytes32,address,uint256)", [
        loanOrderHash,
        depositTokenAddress,
        depositAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).depositCollateral.estimateGasAsync.bind(self, loanOrderHash, depositTokenAddress, depositAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanOrderHash: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("depositCollateral(bytes32,address,uint256)", [
        loanOrderHash,
        depositTokenAddress,
        depositAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(loanOrderHash: string, depositTokenAddress: string, depositAmount: BigNumber): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("depositCollateral(bytes32,address,uint256)", [
        loanOrderHash,
        depositTokenAddress,
        depositAmount
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanOrderHash: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("depositCollateral(bytes32,address,uint256)", [
        loanOrderHash,
        depositTokenAddress,
        depositAmount
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("depositCollateral(bytes32,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public withdrawCollateralForBorrower = {
    async sendTransactionAsync(
      loanOrderHash: string,
      withdrawAmount: BigNumber,
      trader: string,
      receiver: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("withdrawCollateralForBorrower(bytes32,uint256,address,address)", [
        loanOrderHash,
        withdrawAmount,
        trader,
        receiver
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).withdrawCollateralForBorrower.estimateGasAsync.bind(self, loanOrderHash, withdrawAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanOrderHash: string,
      withdrawAmount: BigNumber,
      trader: string,
      receiver: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("withdrawCollateralForBorrower(bytes32,uint256,address,address)", [
        loanOrderHash,
        withdrawAmount,
        trader,
        receiver
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanOrderHash: string,
      withdrawAmount: BigNumber,
      trader: string,
      receiver: string
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("withdrawCollateralForBorrower(bytes32,uint256,address,address)", [
        loanOrderHash,
        withdrawAmount,
        trader,
        receiver
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanOrderHash: string,
      withdrawAmount: BigNumber,
      trader: string,
      receiver: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, string]> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("withdrawCollateralForBorrower(bytes32,uint256,address,address)", [
        loanOrderHash,
        withdrawAmount,
        trader,
        receiver
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("withdrawCollateralForBorrower(bytes32,uint256,address,address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, string]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super("iBZx", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
