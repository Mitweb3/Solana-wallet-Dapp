import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useState } from 'react';

const Airdrop = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState(1); // Default value
    const [message, setMessage] = useState(''); // To display success/error messages

    async function requestAirdrop() {
      if (!wallet.publicKey) {
          setMessage('Please connect your wallet.');
          return;
      }
  
      if (amount <= 0) {
          setMessage('Amount must be greater than 0.');
          return;
      }
  
      try {
          const signature = await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
          
          // Change here: specify the commitment level (e.g., 'confirmed')
          const confirmation = await connection.confirmTransaction(signature, 'confirmed');
          
          if (confirmation.value.err) {
              setMessage('Airdrop failed. Please try again later.');
          } else {
              setMessage(`Airdrop of ${amount} SOL successful!`);
          }
      } catch (error) {
          console.error(error);
          setMessage('Airdrop failed. Please try again later.');
      }
  }
  

    return (
        <div>
            <input
                type="number"
                placeholder='Amount'
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={requestAirdrop}>Request Airdrop</button>
            {message && <p>{message}</p>} {/* Display message */}
        </div>
    );
};

export default Airdrop;
