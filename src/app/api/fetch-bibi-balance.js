// pages/api/fetch-bibi-balance.js
import { Connection, PublicKey } from '@solana/web3.js';

// Replace with your desired Solana cluster
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Bibi Token Mint Address
const BIBI_TOKEN_MINT_ADDRESS = 'HPywjr3AchS3Z7JGJRJ4oqxhpDAw7CgmUffCXsZHbq9G';

export default async function handler(req, res) {
    console.log('Request received:', req.method, req.query);

    if (req.method !== 'GET') {
        console.log('Invalid request method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { address } = req.query;

    if (!address) {
        console.log('No address provided');
        return res.status(400).json({ error: 'Solana address is required' });
    }

    console.log('Fetching balance for address:', address);

    try {
        const publicKey = new PublicKey(address);
        const bibiMint = new PublicKey(BIBI_TOKEN_MINT_ADDRESS);

        console.log('Public key and Bibi mint address:', publicKey.toString(), bibiMint.toString());

        // Use JSON-RPC method to get token accounts by owner
        const response = await connection.getTokenAccountsByOwner(publicKey, {
            mint: bibiMint,
        });

        console.log('Response from getTokenAccountsByOwner:', response);

        let totalBalance = 0;

        if (response.value.length > 0) {
            response.value.forEach(accountInfo => {
                const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
                totalBalance += amount;
            });
        }

        console.log('Total Bibi token balance:', totalBalance);

        res.status(200).json({ balance: totalBalance });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Error fetching balance' });
    }
}
