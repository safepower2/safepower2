import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { AuthAdapter } from '@web3auth/auth-adapter';
import RPC from './ethersRPC';
import './Auth.css';
import { getSHA256Hash } from '../../utils/handleHash';
import ChooseFile from '../ChooseFile';
import logo from '../../assets/1.png';
const clientId = import.meta.env.VITE_POWER_CLIENT_ID;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
  displayName: 'Ethereum Sepolia Testnet',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
};
const web3auth = new Web3AuthNoModal(web3AuthOptions);
const authadapter = new AuthAdapter();
web3auth.configureAdapter(authadapter);

export async function generateUserSeed() {
  if (!web3auth?.provider) {
    console.log('provider not initialized yet');
    return;
  }
  const privateKey = await web3auth?.provider?.request({
    method: 'eth_private_key',
  });
  return getSHA256Hash(privateKey);
  return getSHA256Hash(privateKey);
}

function Auth({ loggedIn, setLoggedIn }) {
  const [provider, setProvider] = useState(null);
  const [accAddress, setAccAddress] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      if (!provider) {
        console.log('provider not initialized yet');
        return;
      }
      const address = await RPC.getAccounts(provider);
      if  (typeof address === 'string') {
        setAccAddress(address);
      }
    };
    getAccounts();
  }, [provider, loggedIn]);

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const login = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: 'google',
      });
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const loggedInView = (
    <div className="btn-container">
      <button
        className="btn-login btn-margin"
        onClick={() => navigator.clipboard.writeText(accAddress)}
      >
        Copy Address
      </button>
      <button onClick={logout} className="btn-login">
        Log Out
      </button>
    </div>
  );

  const unloggedInView = (
    <div className="login-container">

      <img src={logo} alt="Your Logo" className="our-logo" />

      <button onClick={login} className="btn-login">
        <img
          src="https://img.icons8.com/?size=100&id=qt6HeTH0Sv6S&format=png&color=000000"
          alt="Google Logo"
          className="google-logo"
        />
        Login with Google
      </button>
    </div>
  );

  return (
    <div className="header-container">
      {loggedIn ? loggedInView : unloggedInView}
      {loggedIn && <ChooseFile account={accAddress} />}
    </div>
  );
}

export default Auth;

Auth.propTypes = {
  loggedIn: PropTypes.bool,
  setLoggedIn: PropTypes.func.isRequired,
};
