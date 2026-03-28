package auth

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
)

type CustomClaims struct {
	Email string `json:"email"`
	Sub   string `json:"sub"`
}

func ValidateAuth(r *http.Request) (*clerk.SessionClaims, error) {
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))
	token := r.Header.Get("Authorization")
	token = strings.TrimPrefix(token, "Bearer ")

	return jwt.Verify(r.Context(), &jwt.VerifyParams{
		Token: token,
		CustomClaimsConstructor: func(_ context.Context) any {
			return &CustomClaims{}
		},
	})
}
