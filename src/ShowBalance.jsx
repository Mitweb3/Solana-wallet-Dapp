import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

const ShowBalance = () => {
    const wallet = useWallet()
    const {connection} = useConnection()
    const [balance , setBalance] = useState(null)

    useEffect(() => {
        async function getBalance() {
            if(!wallet.publicKey) {
                setBalance(null)
                return;
            }

            try {
                const balance = await connection.getBalance(wallet.publicKey)
                setBalance(balance / 1000000000)
            } catch (err) {
                console.error("failed to fetch balance", err)
            }
        }

        getBalance()
    }, [connection, wallet.publicKey,balance])

  return (
    <div>
        {wallet.publicKey ? (
            balance !== null ? (
                `SOL Balance: ${balance.toFixed(2)}`
            ) : (
                "Fetching balance ..."
            )
        ) : (
            "wallet not connected"
        )}
    </div>
  )
}

export default ShowBalance
