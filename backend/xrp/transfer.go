package xrp

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
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

type TransactionInfo struct {
	Hash             string  `json:"hash"`
	AmountXRP        float64 `json:"amountXRP"`
	Destination      string  `json:"destination"`
	Timestamp        string  `json:"timestamp"`
	OrganizationID   string  `json:"organizationID,omitempty"`
	OrganizationName string  `json:"organizationName,omitempty"`
	IsIncoming       bool    `json:"isIncoming,omitempty"`
}

func GetPlatformWalletOutgoingTransactions() ([]TransactionInfo, error) {
	platformWalletSeed := os.Getenv("PLATFORM_WALLET_SEED")
	if platformWalletSeed == "" {
		return nil, fmt.Errorf("PLATFORM_WALLET_SEED environment variable not set")
	}
	w, err := wallet.FromSeed(platformWalletSeed, "")
	if err != nil {
		return nil, err
	}

	clientConfig := websocket.NewClientConfig().
		WithHost("wss://s.altnet.rippletest.net:51233").
		WithFaucetProvider(faucet.NewTestnetFaucetProvider())
	client := websocket.NewClient(clientConfig)
	defer client.Disconnect()
	if err := client.Connect(); err != nil {
		return nil, fmt.Errorf("Failed to connect to XRPL: %w", err)
	}

	txs, err := client.GetAccountTransactions(&account.TransactionsRequest{
		Account: w.GetAddress(),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get account transactions: %w", err)
	}

	var platformAddress = string(w.GetAddress())
	var txns []TransactionInfo
	for _, txWrapper := range txs.Transactions {
		tx := txWrapper.Tx
		if tx == nil {
			continue
		}

		txJSON, err := json.Marshal(tx)
		if err != nil {
			continue
		}

		var txMap map[string]interface{}
		if err := json.Unmarshal(txJSON, &txMap); err != nil {
			continue
		}

		txType, ok := txMap["TransactionType"].(string)
		if !ok || txType != "Payment" {
			continue
		}

		sender, ok := txMap["Account"].(string)
		if !ok {
			continue
		}

		destAddr, ok := txMap["Destination"].(string)
		if !ok || destAddr == "" {
			continue
		}

		var amountXRP float64
		isIncoming := sender != platformAddress
		if isIncoming {
			continue
		}

		if amt, ok := txMap["Amount"].(string); ok {
			drops, err := strconv.ParseUint(amt, 10, 64)
			if err == nil {
				amountXRP = float64(drops) / 1000000.0
			}
		} else if delMax, ok := txMap["DeliverMax"].(string); ok {
			drops, err := strconv.ParseUint(delMax, 10, 64)
			if err == nil {
				amountXRP = float64(drops) / 1000000.0
			}
		}

		if amountXRP == 0 {
			continue
		}

		txnTime := time.Now()

		txns = append(txns, TransactionInfo{
			Hash:        string(txWrapper.Hash),
			AmountXRP:   amountXRP,
			Destination: destAddr,
			Timestamp:   txnTime.Format(time.RFC3339),
			IsIncoming:  isIncoming,
		})
	}

	return txns, nil
}
