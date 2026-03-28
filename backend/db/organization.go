package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/nishoof/blockchain-hack/backend/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type OrganizationRepository struct {
	collection *mongo.Collection
}

func NewOrganizationRepository() (*OrganizationRepository, error) {
	db := GetDatabase()
	if db == nil {
		return nil, fmt.Errorf("database not initialized")
	}
	return &OrganizationRepository{
		collection: db.Collection("organizations"),
	}, nil
}

func (r *OrganizationRepository) GetByID(ctx context.Context, id string) (*models.Organization, error) {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid organization ID: %w", err)
	}

	var org models.Organization
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&org)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &org, nil
}
