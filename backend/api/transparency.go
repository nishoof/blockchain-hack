package handler

import (
	"encoding/json"
	"net/http"

	"github.com/nishoof/blockchain-hack/backend/db"
	"github.com/nishoof/blockchain-hack/backend/models"
	"github.com/nishoof/blockchain-hack/backend/xrp"
)

func TransparencyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	txs, err := xrp.GetPlatformWalletOutgoingTransactions()
	if err != nil {
		http.Error(w, "Failed to fetch transactions", http.StatusInternalServerError)
		return
	}

	orgRepo, err := db.NewOrganizationRepository()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	orgs, err := orgRepo.GetAll(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch organizations", http.StatusInternalServerError)
		return
	}

	orgMap := make(map[string]models.Organization)
	for _, org := range orgs {
		orgMap[org.XRPWalletAddress] = org
	}

	for i := range txs {
		if org, ok := orgMap[txs[i].Destination]; ok {
			txs[i].OrganizationID = org.ID.Hex()
			txs[i].OrganizationName = org.Name
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"transactions": txs,
	})
}
