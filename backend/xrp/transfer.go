package xrp

import (
	"fmt"
	"os"

	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/transactions"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func TransferFromPlatformWallet(toAddress string, xrpDropsAmountInt uint64) (*transactions.TxResponse, error) {
	// Load platform wallet
	platformWalletSeed := os.Getenv("PLATFORM_WALLET_SEED")
	if platformWalletSeed == "" {
		return nil, fmt.Errorf("PLATFORM_WALLET_SEED environment variable not set")
	}
	w, err := wallet.FromSeed(platformWalletSeed, "")
	if err != nil {
		return nil, err
	}

	// Connect to Testnet
	clientConfig := websocket.NewClientConfig().
		WithHost("wss://s.altnet.rippletest.net:51233").
		WithFaucetProvider(faucet.NewTestnetFaucetProvider())
	client := websocket.NewClient(clientConfig)
	defer client.Disconnect()
	if err := client.Connect(); err != nil {
		return nil, fmt.Errorf("Failed to connect to XRPL: %w", err)
	}

	// Prepare payment transaction
	p := &transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: types.Address(w.GetAddress()),
		},
		Destination: types.Address(toAddress),
		Amount:      types.XRPCurrencyAmount(xrpDropsAmountInt),
		DeliverMax:  types.XRPCurrencyAmount(xrpDropsAmountInt),
	}

	flattenedTx := p.Flatten()

	if err := client.Autofill(&flattenedTx); err != nil {
		return nil, fmt.Errorf("Failed to autofill transaction: %w", err)
	}

	// Sign the transaction
	signedTxBlob, _, err := w.Sign(flattenedTx)
	if err != nil {
		return nil, fmt.Errorf("Failed to sign transaction: %w", err)
	}

	// Submit the transaction and wait for the result
	txResponse, err := client.SubmitTxBlobAndWait(signedTxBlob, false)
	if err != nil {
		return nil, fmt.Errorf("Failed to submit transaction: %w", err)
	}

	return txResponse, nil
}
