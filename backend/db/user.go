package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/nishoof/blockchain-hack/backend/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type UserRepository struct {
	collection *mongo.Collection
}

var ErrUserAlreadyExists = errors.New("user already exists")

func NewUserRepository() (*UserRepository, error) {
	db := GetDatabase()
	if db == nil {
		return nil, fmt.Errorf("database not initialized")
	}
	collection := db.Collection("users")
	if err := ensureUniqueIndexOnEmail(collection); err != nil {
		return nil, fmt.Errorf("failed to create index: %w", err)
	}
	return &UserRepository{
		collection: collection,
	}, nil
}

func ensureUniqueIndexOnEmail(collection *mongo.Collection) error {
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	_, err := collection.Indexes().CreateOne(context.Background(), indexModel)
	return err
}

func (r *UserRepository) Create(ctx context.Context, email string, balanceUSD string) error {
	user := models.User{
		Email:      email,
		BalanceUSD: balanceUSD,
	}
	_, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		var we mongo.WriteException
		if errors.As(err, &we) {
			for _, e := range we.WriteErrors {
				if e.Code == 11000 {
					return ErrUserAlreadyExists
				}
			}
		}
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func (r *UserRepository) GetBalanceByEmail(ctx context.Context, email string) (string, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return "", nil
		}
		return "", err
	}
	return user.BalanceUSD, nil
}

func (r *UserRepository) UpdateBalanceByEmail(ctx context.Context, email string, balanceUSD string) error {
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": bson.M{"balanceUSD": balanceUSD}},
	)
	return err
}
