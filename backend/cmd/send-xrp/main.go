package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
	if len(os.Args) != 4 {
		fmt.Println("Usage: main <wallet_seed> <destination_address> <xrp_amount>")
		os.Exit(1)
	}

	walletSeed := os.Args[1]
	destinationAddress := os.Args[2]
	xrpAmountInt, err := strconv.ParseInt(os.Args[3], 10, 64)
	if err != nil {
		panic(err)
	}

	w, err := wallet.FromSeed(walletSeed, "")
	if err != nil {
		panic(err)
	}
	fromAddress := w.ClassicAddress
	fmt.Println("Address:", fromAddress)

	// Connect to Testnet
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)

	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// Prepare payment transaction
	p := &transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: types.Address(w.GetAddress()),
		},
		Destination: types.Address(destinationAddress),
		Amount:      types.XRPCurrencyAmount(xrpAmountInt),
		DeliverMax:  types.XRPCurrencyAmount(xrpAmountInt),
	}

	flattenedTx := p.Flatten()

	if err := client.Autofill(&flattenedTx); err != nil {
		panic(err)
	}

	// Sign the transaction
	signedTxBlob, _, err := w.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	// Submit the transaction and wait for the result
	txResponse, err := client.SubmitTxBlobAndWait(signedTxBlob, false)
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction response:", txResponse)
}
