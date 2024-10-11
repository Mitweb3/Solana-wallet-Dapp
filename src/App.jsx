import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import Airdrop from './Airdrop';
import ShowBalance from './ShowBalance';
import SendTokens from './SendTokens';
import { Buffer } from 'buffer';
import SignMessage from './SignMessage';
import Swap from './Swap';

// Make Buffer globally available (for Solana web3.js)
window.Buffer = Buffer;



function App() {
 

  return (
    <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/EKhanYsvBwNSB8Cm3VmOvn0GIv1IP1Ms"}>
    <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
            <div className="container">
                <div className="wallet-buttons">
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                </div> <br />
                <Airdrop/>
                <br />
                <ShowBalance/>
                <br />
                <SendTokens/>
                <br />
                <SignMessage/>
                <br />
                <Swap/>
            </div>
        </WalletModalProvider>
    </WalletProvider>
</ConnectionProvider>
  );
}

export default App