import {  useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import bs58 from 'bs58'; // for encoding the signature

const SignMessage = () => {
    const wallet = useWallet();
    const [message, setMessage] = useState('');

    const onClick = async () => {
        if (!wallet.publicKey) {
            alert("Please connect your wallet");
            return;
        }

        try {
            const encodedMessage = new TextEncoder().encode(message);

            // Check if the wallet supports signing messages
            if (!wallet.signMessage) {
                throw new Error('Wallet does not support message signing!');
            }

            // Sign the message
            const signature = await wallet.signMessage(encodedMessage);
            alert(`Message signed successfully! Signature: ${bs58.encode(signature)}`);
        } catch (error) {
            console.error('Error signing message:', error);
            alert('Error signing message. Check console for details.');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={onClick}>
                Sign message
            </button>
        </div>
    );
};

export default SignMessage;
