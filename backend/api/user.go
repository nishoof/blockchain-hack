package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/nishoof/blockchain-hack/backend/db"
)

func UserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		createUser(w, r)
		return
	}
	if r.Method == http.MethodGet {
		getBalance(w, r)
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	userRepo, err := db.NewUserRepository()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	const initialBalanceXRP = "100" // 100 XRP (150 USD) for new users
	if err := userRepo.Create(r.Context(), req.Email, initialBalanceXRP); err != nil {
		if errors.Is(err, db.ErrUserAlreadyExists) {
			http.Error(w, "User already exists", http.StatusConflict)
			return
		}
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created"})
}

func getBalance(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Email query parameter is required", http.StatusBadRequest)
		return
	}

	userRepo, err := db.NewUserRepository()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	balance, err := userRepo.GetBalanceByEmail(r.Context(), email)
	if err != nil {
		http.Error(w, "Failed to get balance", http.StatusInternalServerError)
		return
	}

	if balance == "" {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"email": email, "balanceXRP": balance})
}
