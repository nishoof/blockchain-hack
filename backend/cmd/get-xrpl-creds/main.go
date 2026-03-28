package main

import (
	"fmt"
	"os"

	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: get-xrpl-creds <wallet-seed>")
		os.Exit(1)
	}
	walletSeed := os.Args[1]
	w, err := wallet.FromSeed(walletSeed, "")
	if err != nil {
		panic(err)
	}
	fmt.Println("Address:", w.ClassicAddress)
}
