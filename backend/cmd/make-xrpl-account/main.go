package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/queries/ledger"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
	// Define the network client with a faucet provider
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)
	defer client.Disconnect()

	// Connect to the network
	if err := client.Connect(); err != nil {
		panic(err)
	}

	if !client.IsConnected() {
		fmt.Println("Failed to connect to testnet")
		return
	}

	fmt.Println("Connected to testnet")

	// Create a new wallet
	w, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	fmt.Println("New wallet created:")
	fmt.Println("Address:", w.ClassicAddress)
	fmt.Println("Seed:", w.Seed)

	// Fund the wallet with testnet XRP
	if err := client.FundWallet(&w); err != nil {
		panic(err)
	}

	// Get info from the ledger about the address we just funded
	accountInfo, err := client.GetAccountInfo(&account.InfoRequest{
		Account: w.GetAddress(),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Account Balance:", accountInfo.AccountData.Balance)
	fmt.Println("Account Sequence:", accountInfo.AccountData.Sequence)

	// Get info about the ledger
	ledger, err := client.GetLedger(&ledger.Request{LedgerIndex: common.Current})
	if err != nil {
		panic(err)
	}
	fmt.Println("Ledger Index:", ledger.Ledger.LedgerIndex)
}
