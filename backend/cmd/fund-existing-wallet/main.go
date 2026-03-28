package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: fund-existing-wallet <wallet-seed>")
		os.Exit(1)
	}
	walletSeed := os.Args[1]
	var n int64 = 1
	if len(os.Args) == 3 {
		var err error
		n, err = strconv.ParseInt(os.Args[2], 10, 64)
		if err != nil {
			fmt.Println("Invalid number of funding repeats:", os.Args[2])
			os.Exit(1)
		}
	}

	// Get wallet
	w, err := wallet.FromSeed(walletSeed, "")
	if err != nil {
		panic(err)
	}
	fmt.Println("Existing wallet retrieved:")
	fmt.Println("Address:", w.ClassicAddress)
	fmt.Println("Seed:", w.Seed)

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

	// Fund the wallet with testnet XRP
	for i := 0; i < int(n); i++ {
		if err := client.FundWallet(&w); err != nil {
			panic(err)
		}
		fmt.Printf("Funding attempt %d successful\n", i+1)
	}
}
