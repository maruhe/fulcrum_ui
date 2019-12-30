import { BigNumber } from "@0x/utils";
import React, {ChangeEvent, Component} from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import bgDai  from "../assets/images/ic_token_dai.svg";
import bgUsdc  from "../assets/images/ic_token_usdc.svg";
import bgSai  from "../assets/images/ic_token_sai.svg";
import bgEth  from "../assets/images/ic_token_eth.svg";
import bgBtc  from "../assets/images/ic_token_btc.svg";
import bgRep  from "../assets/images/ic_token_rep.svg";
import bgZrx  from "../assets/images/ic_token_zrx.svg";
import bgKnc  from "../assets/images/ic_token_knc.svg";
import bgLink  from "../assets/images/ic_token_link.svg";
import torque_logo from "../assets/images/torque_logo.svg";
import arrow_right from "../assets/images/right-arrow.svg";
import { RefinanceData } from "../domain/RefinanceData";
import maker_img from "../assets/images/maker.svg";

export interface IRefinanceAssetSelectorItemProps {
  asset: Asset;
  cdpId:BigNumber;
  urn:string;
  ilk:string;
  accountAddress:string;
  proxyAddress:string;
  isProxy:boolean;
  // onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceAssetSelectorItemState {
  inputAmountText: number;
  borrowAmount: BigNumber;
  refinanceData: RefinanceData[];
}

export class RefinanceAssetSelectorItem extends Component<IRefinanceAssetSelectorItemProps, IRefinanceAssetSelectorItemState> {
  private _input: HTMLInputElement | null = null;
  private readonly _inputTextChange: Subject<number>;
  constructor(props: IRefinanceAssetSelectorItemProps) {
    super(props);
    this.state = {
      inputAmountText: 0,
      borrowAmount: new BigNumber(0),
      refinanceData:
      [{
        collateralType: '',
        collateralAmount: new BigNumber(0),
        debt: new BigNumber(0),
        cdpId: new BigNumber(0),
        accountAddress: '',
        proxyAddress: '',
        isProxy:false
      }]};
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    this._inputTextChange = new Subject<number>();
    // this._inputTextChange
    //   .pipe(
    //     debounceTime(100),
    //     switchMap(value => this.rxConvertToBigNumber(value)),
    //     // switchMap(value => this.rxGetEstimate(value))
    //   )
      // .subscribe((value: IBorrowEstimate) => {
      //   this.setState({
      //     ...this.state,
      //     depositAmount: value.depositAmount
      //   });
      // });
  }
  private rxConvertToBigNumber = (textValue: string): Observable<BigNumber> => {
    return new Observable<BigNumber>(observer => {
      observer.next(new BigNumber(textValue));
    });
  };

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IRefinanceAssetSelectorItemProps>,
    prevState: Readonly<IRefinanceAssetSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.asset !== prevProps.asset) {
      this.derivedUpdate();
    }
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private derivedUpdate = async () => {
    if (this.props.cdpId.gt(0)){
      const refinanceData = await TorqueProvider.Instance.getCdpsVat(this.props.cdpId, this.props.urn, this.props.ilk, this.props.accountAddress,  this.props.isProxy, this.props.proxyAddress);
      this.setState({ ...this.state, refinanceData: refinanceData });
    }
  };
  public loanAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : '0';
    // console.log(amountText);
    // setting inputAmountText to update display at the same time

    this.setState({
      ...this.state,
      inputAmountText: parseInt(amountText),
      borrowAmount: new BigNumber(amountText)
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };

  private checkCdpManager = async () => {

    const refinanceData = await TorqueProvider.Instance.checkCdpManager(this.state.refinanceData[0], this.state.borrowAmount);
  }

  public render() {
    const assetTypeModifier = "asset-selector-item--"+this.props.asset.toLowerCase();
    const assetsDt: any = this.getAssestsData()
    if(this.state.refinanceData[0].debt.gt(0) || this.state.refinanceData[0].collateralAmount.gt(0)){
    return (
      <div className={`refinance-asset-selector-item `} >
        <div className="refinance-asset-selector__title">CDP {this.state.refinanceData[0].cdpId.toFixed(0)}</div>
        <div className="refinance-asset-selector__row">
          <div className="refinance-asset-selector__marker"><img className="logo__maker" src={maker_img} /> <img className="right-icon" src={arrow_right} /></div>
          <div className="refinance-asset-selector__torque"><img className="logo__image" src={torque_logo} alt="torque-logo" /></div>
          {/*<div className="refinance-asset-selector__type">1.500</div>*/}
        </div>
        <div className="refinance-asset-selector__rowimg">
            <div className="refinance-asset-selector__varapy">10%</div>
            <div className="refinance-asset-selector__fixedapy">3%</div>
            {/*<div className="refinance-asset-selector__img"><img src={assetsDt.img} /></div>*/}
        </div>
        <div className="refinance-asset-selector__row mb2">
            <div className="refinance-asset-selector__variabletxt">Variabl APY</div>
            <div className="refinance-asset-selector__aprtxt">Fixed APY</div>
            {/*<div className="refinance-asset-selector__imgtxt">{this.props.asset}</div>*/}
        </div>
        <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__inputBox">
              <div className="refinance__input-container">
                <input
                  ref={this._setInputRef}
                  className="refinance__input-container__input-amount"
                  type="number"
                  placeholder={`Amount`}
                  onChange={this.loanAmountChange}
                />
              </div>
            </div>
            <div className="refinance-asset-selector__loan">
              {this.state.refinanceData[0].debt.toFixed(2)}
              <div className="refinance-asset-selector__loantxt">Loan</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <img className="refinance-loan-type__img" src={assetsDt.img} />
              <div className="refinance-asset-selector__loantxt">{this.props.asset}</div>
            </div>

        </div>
        <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__loanBlank">

            </div>
            <div className="refinance-asset-selector__loan">
              {this.state.refinanceData[0].collateralAmount.toFixed(2)}
              <div className="refinance-asset-selector__loantxt">Collateral</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <img className="refinance-loan-type__img" src={bgEth} />
              <div className="refinance-asset-selector__loantxt">{this.state.refinanceData[0].collateralType}</div>
            </div>

        </div>
        <div className="refinance-asset-selector__desc">{assetsDt.title}
          <div className="refinance-asset-selector__rs">$150/mo or $1500/yr</div>
        </div>
        <div className="refinance-selector-icons__item refinance-selector-icons-bar__button" onClick={this.checkCdpManager}>
            Refinance with 3% APR Fixed
        </div>
      </div>
    )
    }else{
      return ''
    }
  }

  private getAssestsData = () => {
    console.log("assestsType = ", this.props.asset)
    switch (this.props.asset) {
      case Asset.DAI:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgDai}
        break;
      case Asset.SAI:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgSai}
        break;
      case Asset.USDC:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgUsdc}
        break;
      case Asset.ETH:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgEth}
        break;
      case Asset.WBTC:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgBtc}
        break;
      case Asset.LINK:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgLink}
        break;
      case Asset.ZRX:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgZrx}
        break;
      case Asset.REP:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgRep}
        break;
      case Asset.KNC:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgKnc}
        break;
    }
  }



  // private onClick = () => {
  //   if (this.props.onSelectAsset) {
  //     this.props.onSelectAsset(this.props.asset);
  //   }
  // };
}
