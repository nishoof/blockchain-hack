package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/nishoof/blockchain-hack/backend/auth"
	"github.com/nishoof/blockchain-hack/backend/db"
	"github.com/nishoof/blockchain-hack/backend/xrp"
)

func DonateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	claims, err := auth.ValidateAuth(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	customClaims, ok := claims.Custom.(*auth.CustomClaims)
	if !ok {
		http.Error(w, "Invalid custom claims", http.StatusUnauthorized)
		return
	}
	donorEmail := customClaims.Email

	organizationID, amount, err := parseAndValidateDonateRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userRepo, err := db.NewUserRepository()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	orgRepo, err := db.NewOrganizationRepository()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	org, err := orgRepo.GetByID(r.Context(), organizationID)
	if err != nil {
		http.Error(w, "Failed to get organization", http.StatusInternalServerError)
		return
	}
	if org == nil {
		http.Error(w, "Organization not found", http.StatusNotFound)
		return
	}

	balance, err, errHttpCode := getUserBalanceAndCheckSufficient(r.Context(), userRepo, donorEmail, amount)
	if err != nil {
		http.Error(w, err.Error(), errHttpCode)
		return
	}

	newBalance := balance - amount
	newBalanceStr := fmt.Sprintf("%.6f", newBalance)
	if err := userRepo.UpdateBalanceByEmail(r.Context(), donorEmail, newBalanceStr); err != nil {
		http.Error(w, "Failed to update balance", http.StatusInternalServerError)
		return
	}

	xrpDropsAmount := uint64(amount * 1000000)

	txResponse, err := xrp.TransferFromPlatformWallet(org.XRPWalletAddress, xrpDropsAmount)
	if err != nil {
		if rollbackErr := userRepo.UpdateBalanceByEmail(r.Context(), donorEmail, fmt.Sprintf("%.6f", balance)); rollbackErr != nil {
			log.Printf("Failed to rollback balance: %v", rollbackErr)
		}
		http.Error(w, "Transfer failed", http.StatusInternalServerError)
		log.Printf("Transfer failed: %v", err)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":          "Donation successful",
		"newBalance":       newBalanceStr,
		"organizationName": org.Name,
		"amountXRP":        amount,
		"transactionHash":  txResponse.Hash,
	})
}

func parseAndValidateDonateRequest(r *http.Request) (string, float64, error) {
	var req struct {
		OrganizationID string `json:"organizationID"`
		AmountXRP      string `json:"amountXRP"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return "", 0, fmt.Errorf("Invalid request body")
	}

	if req.OrganizationID == "" {
		return "", 0, fmt.Errorf("Organization ID is required")
	}
	if req.AmountXRP == "" {
		return "", 0, fmt.Errorf("Amount is required")
	}

	amount, err := strconv.ParseFloat(req.AmountXRP, 64)
	if err != nil || amount <= 0 {
		return "", 0, fmt.Errorf("Invalid amount")
	}
	return req.OrganizationID, amount, nil
}

func getUserBalanceAndCheckSufficient(ctx context.Context, userRepo *db.UserRepository, email string, amount float64) (float64, error, int) {
	balanceStr, err := userRepo.GetBalanceByEmail(ctx, email)
	if err != nil {
		return 0, fmt.Errorf("Failed to get balance"), http.StatusInternalServerError
	}
	if balanceStr == "" {
		return 0, fmt.Errorf("User not found"), http.StatusNotFound
	}

	balance, err := strconv.ParseFloat(balanceStr, 64)
	if err != nil {
		return 0, fmt.Errorf("Invalid balance"), http.StatusInternalServerError
	}

	if balance < amount {
		return 0, fmt.Errorf("Insufficient balance"), http.StatusBadRequest
	}

	return balance, nil, 0
}
