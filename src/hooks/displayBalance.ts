import { Connection, PublicKey } from "@solana/web3.js";

const SOLANA_RPC_ENDPOINT =
  "https://solana-mainnet.g.alchemy.com/v2/Ezf44rp49UO6_D7pUfYjaXHFXwbIqRlc";

export const fetchBal = async (): Promise<number> => {
  const address = localStorage.getItem("solanaAddress");
  if (!address) throw new Error("No Solana address found in localStorage");

  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT);
    const publicKey = new PublicKey(address);
    const bibiTokenMintAddress = "HPywjr3AchS3Z7JGJRJ4oqxhpDAw7CgmUffCXsZHbq9G";
    const bibiTokenBalance = await getTokenBalance(
      connection,
      publicKey,
      bibiTokenMintAddress
    );

    return bibiTokenBalance;
  } catch (err) {
    console.error("Error fetching balance:", err);
    return 0;
  }
};

const getTokenBalance = async (
  connection: Connection,
  publicKey: PublicKey,
  tokenMintAddress: string
): Promise<number> => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        mint: new PublicKey(tokenMintAddress),
      }
    );
    const balanceInfo =
      tokenAccounts.value[0]?.account?.data?.parsed?.info?.tokenAmount
        ?.uiAmount;
    return balanceInfo || 0;
  } catch (err) {
    console.error("Error fetching token balance:", err);
    return 0;
  }
};
