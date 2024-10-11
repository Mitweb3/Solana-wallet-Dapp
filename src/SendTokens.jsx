import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import React, { useState } from 'react'

const SendTokens = () => {
    const wallet = useWallet()
    const {connection} = useConnection()
    const [to, setTo] = useState(null)
    const [amount, setAmount] = useState(null)

    async function sendTokens() {
        const transaction = new Transaction()
        transaction.add(SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(to),
            lamports: amount * LAMPORTS_PER_SOL
        }))
        await wallet.sendTransaction(transaction, connection)
        alert("Sent" + amount + "SOL to" + to)

    }

  return (
    <div>
      <input type="text"  placeholder='To' onChange={(e) => setTo(e.target.value)}/>
      <input type="text"  placeholder='Amount' onChange={(e) => setAmount(e.target.value)} />
      <button onClick={sendTokens}>Send</button>
    </div>
  )
}

export default SendTokens
