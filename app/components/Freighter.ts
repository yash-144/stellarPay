import { signTransaction, setAllowed, getAddress } from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

// ─── Horizon Server (Testnet) ───────────────────────────────────────────────
const server = new StellarSdk.Horizon.Server(
    "https://horizon-testnet.stellar.org"
);

const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

// ─── Wallet Helpers ─────────────────────────────────────────────────────────

/** Prompt the user to allow this dApp in Freighter. */
const checkConnection = async () => {
    return await setAllowed();
};

/** Retrieve the connected wallet's public key. */
const retrievePublicKey = async (): Promise<string> => {
    const { address } = await getAddress();
    return address;
};

// ─── Balance ────────────────────────────────────────────────────────────────

/** Fetch XLM balance for the connected wallet. */
const getBalance = async (): Promise<string> => {
    await setAllowed();
    const { address } = await getAddress();
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b) => b.asset_type === "native");
    return xlm?.balance || "0";
};

// ─── Send Payment ───────────────────────────────────────────────────────────

interface PaymentResult {
    success: boolean;
    hash?: string;
    error?: string;
}

/**
 * Build, sign, and submit an XLM payment on the Stellar testnet.
 *
 * @param destination - Recipient's Stellar public key
 * @param amount      - Amount of XLM to send (as a string, e.g. "10.5")
 * @returns           - { success, hash } on success or { success, error } on failure
 */
const sendPayment = async (
    destination: string,
    amount: string
): Promise<PaymentResult> => {
    try {
        // 1. Get sender address
        const { address: senderPublicKey } = await getAddress();

        // 2. Load sender account from Horizon
        const senderAccount = await server.loadAccount(senderPublicKey);

        // 3. Build the transaction
        const transaction = new StellarSdk.TransactionBuilder(senderAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                StellarSdk.Operation.payment({
                    destination,
                    asset: StellarSdk.Asset.native(),
                    amount,
                })
            )
            .setTimeout(30)
            .build();

        // 4. Sign via Freighter
        const transactionXDR = transaction.toXDR();

        const signedResponse = await signTransaction(transactionXDR, {
            networkPassphrase: NETWORK_PASSPHRASE,
            address: senderPublicKey,
        });

        // 5. Re-create the signed transaction envelope and submit
        const signedXDR =
            typeof signedResponse === "string"
                ? signedResponse
                : signedResponse.signedTxXdr;

        const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
            signedXDR,
            NETWORK_PASSPHRASE
        );

        const result = await server.submitTransaction(signedTransaction);

        return { success: true, hash: result.hash };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Transaction failed";
        return { success: false, error: message };
    }
};

// ─── Sign Transaction (generic) ─────────────────────────────────────────────

const userSignTransaction = async (
    xdr: string,
    network: string,
    signWith: string
) => {
    return await signTransaction(xdr, {
        networkPassphrase: network,
        address: signWith,
    });
};

// ─── Exports ────────────────────────────────────────────────────────────────

export {
    checkConnection,
    retrievePublicKey,
    getBalance,
    sendPayment,
    userSignTransaction,
    server,
    NETWORK_PASSPHRASE,
};