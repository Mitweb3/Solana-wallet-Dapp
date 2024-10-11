import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import axios from 'axios';
import { LAMPORTS_PER_SOL, VersionedTransaction } from '@solana/web3.js';

const Swap = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleButton() {
        setErrorMessage(''); // Reset error message

        if (!wallet.connected || !wallet.publicKey) {
            console.error("Wallet not connected or public key is missing");
            return;
        }

        // Convert amount from SOL to lamports
        const amountInLamports = (parseFloat(amount) * LAMPORTS_PER_SOL).toString(); 

        // Input validation
        if (!amount || isNaN(amountInLamports) || parseFloat(amountInLamports) <= 0) {
            setErrorMessage("Please enter a valid amount greater than 0.");
            return;
        }

        setLoading(true); // Start loading state

        try {
            // Get quote for the swap
            const quoteResponse = await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${amountInLamports}&slippageBps=50`);
            console.log('Quote Response:', quoteResponse.data);

            // Make the swap request
            const swapResponse = await axios.post('https://quote-api.jup.ag/v6/swap', { 
                quoteResponse: quoteResponse.data,
                userPublicKey: wallet.publicKey.toString()
            });
            const  swapTransaction  = swapResponse.data; // Destructure to get swapTransaction
            console.log('Swap Transaction:', swapTransaction);

            // Deserialize the transaction
            const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            console.log('Deserialized Transaction:', transaction);

            // Sign the transaction
            transaction.sign([wallet.publicKey])
            
            const latestBlockHash = await connection.getLatestBlockhash();

            // Execute the transaction
            const rawTransaction = transaction.serialize();
            const txid = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2
            });

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txid
            });

            console.log(`Transaction successful: https://solscan.io/tx/${txid}`);
        } catch (error) {
            console.error("Error during swap:", error.response?.data || error.message);
            setErrorMessage("Transaction failed. Please try again."); // User-friendly error message
        } finally {
            setLoading(false); // Reset loading state
        }
    }

    return (
        <div>
            <h2>Swap from SOL to USDC</h2>
            <input
                type="number"
                placeholder='Amount in SOL'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0" // Prevent negative input
            />
            <button onClick={handleButton} disabled={loading}>
                {loading ? 'Swapping...' : 'Swap'}
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
        </div>
    );
};

export default Swap;
