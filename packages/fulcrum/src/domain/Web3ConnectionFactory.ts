import { EventEmitter } from "events";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";

import { Web3Wrapper } from '@0x/web3-wrapper';

import Portis from "@portis/web3";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Bitski } from "bitski";
// @ts-ignore
import Fortmatic from "fortmatic";
import { ProviderType } from "./ProviderType";

import { MetamaskSubprovider, SignerSubprovider, Web3ProviderEngine } from "@0x/subproviders";
// @ts-ignore
import { AlchemySubprovider } from "@alch/alchemy-web3";

import configProviders from "../config/providers.json";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export class Web3ConnectionFactory {
  public static alchemyProvider: AlchemySubprovider | null;
  public static fortmaticProvider: Fortmatic | null;

  public static async getWeb3Provider(providerType: ProviderType | null, eventEmitter: EventEmitter): Promise<[Web3Wrapper | null, Web3ProviderEngine | null, boolean, number]> {
    let canWrite = false;
    let subProvider: any | null = null;
    let networkId: number;
    if (providerType) {
      switch (providerType) {
        case ProviderType.None: {
          subProvider = null;
          break;
        }
        case ProviderType.Bitski: {
          subProvider = await Web3ConnectionFactory.getProviderBitski();
          break;
        }
        case ProviderType.MetaMask: {
          subProvider = await Web3ConnectionFactory.getProviderMetaMask();
          break;
        }
        case ProviderType.Fortmatic: {
          subProvider = await Web3ConnectionFactory.getProviderFortmatic();
          Web3ConnectionFactory.fortmaticProvider = subProvider ? subProvider : null;
          break;
        }
        case ProviderType.WalletConnect: {
          subProvider = await Web3ConnectionFactory.getProviderWalletConnect();
          break;
        }
        case ProviderType.Portis: {
          subProvider = await Web3ConnectionFactory.getProviderPortis();
          break;
        }
      }
    }

    if (!subProvider) {
      subProvider = null;
    }

    /*
      TODO: 
      Set pollingInterval to 8000. Use https://github.com/MetaMask/eth-block-tracker with Web3ProviderEngine
      to poll for new blocks and use events to update the UI.

      interface Web3ProviderEngineOptions {
          pollingInterval?: number;
          blockTracker?: any;
          blockTrackerProvider?: any;
      }
    */
    
    const providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling

    if (!Web3ConnectionFactory.alchemyProvider) {
      Web3ConnectionFactory.alchemyProvider = new AlchemySubprovider(`https://eth-${ethNetwork}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`, { writeProvider: null });
    }
    providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider);
    if (subProvider) {
      if (providerType === ProviderType.MetaMask) {
        providerEngine.addProvider(new MetamaskSubprovider(subProvider));
      } else {
        providerEngine.addProvider(new SignerSubprovider(subProvider));
      }
      canWrite = true;
    }

    await providerEngine.start();

    const web3Wrapper = new Web3Wrapper(providerEngine);

    if (subProvider && providerType === ProviderType.MetaMask) {
      // @ts-ignore
      subProvider.publicConfigStore.on("update", result =>
        eventEmitter.emit(
          FulcrumProviderEvents.ProviderChanged,
          new ProviderChangedEvent(providerType, web3Wrapper)
        )
      );
      
      networkId = parseInt(subProvider.networkVersion, 10);
    } else {
      networkId = await web3Wrapper.getNetworkIdAsync();
    }

    return [web3Wrapper, providerEngine, canWrite, networkId];
  }

  private static async getProviderMetaMask(): Promise<any | null> {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      await window.ethereum.enable();
      // @ts-ignore
      return window.ethereum;
    } else {
      return null;
    }
  }

  private static async getProviderBitski(): Promise<any> {
    const bitski = new Bitski(configProviders.Bitski_ClientId, `https://${ethNetwork}.fulcrum.trade`);// configProviders.Bitski_CallbackUrl);
    await bitski.signIn();
    return bitski.getProvider();
  }

  private static async getProviderFortmatic(): Promise<any> {
    if (Web3ConnectionFactory.fortmaticProvider) {
      // console.log(Web3ConnectionFactory.fortmaticProvider, Web3ConnectionFactory.fortmaticProvider.user);
      if (!Web3ConnectionFactory.fortmaticProvider.isLoggedIn) {
        await Web3ConnectionFactory.fortmaticProvider.user.login(); 
      }
      return Web3ConnectionFactory.fortmaticProvider;
    } else {
      const fortmatic = await new Fortmatic(configProviders.Fortmatic_ApiKey, ethNetwork);
      const provider = await fortmatic.getProvider();
      // console.log(`provider`,provider);
      await fortmatic.user.login();
      return provider;
    }
  }

  private static async getProviderWalletConnect(): Promise<any> {
    const walletConnector = await new WalletConnectProvider({
      bridge: "https://bridge.walletconnect.org"
    });
 
    // console.log(walletConnector);
    return walletConnector;
  }

  private static async getProviderPortis(): Promise<any> {
    const portis = await new Portis(configProviders.Portis_DAppId, ethNetwork || "");
    return portis.provider;
  }
}