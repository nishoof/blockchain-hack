package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Organization struct {
	ID               bson.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name             string        `bson:"name" json:"name"`
	XRPWalletAddress string        `bson:"xrpWalletAddress" json:"xrpWalletAddress"`
}
