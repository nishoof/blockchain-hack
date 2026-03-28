package db

import (
	"context"
	"fmt"
	"os"
	"sync"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	client *mongo.Client
	once   sync.Once
)

func Connect() error {
	var err error
	once.Do(func() {
		uri := os.Getenv("MONGODB_URI")
		if uri == "" {
			err = fmt.Errorf("MONGODB_URI environment variable is not set")
			return
		}

		serverAPI := options.ServerAPI(options.ServerAPIVersion1)
		opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

		client, err = mongo.Connect(opts)
		if err != nil {
			return
		}

		if err = client.Ping(context.TODO(), nil); err != nil {
			return
		}
		fmt.Println("Connected to MongoDB")
	})
	return err
}

func GetDatabase() *mongo.Database {
	if client == nil {
		if err := Connect(); err != nil {
			return nil
		}
	}
	dbName := "database0"
	return client.Database(dbName)
}

func Disconnect(ctx context.Context) error {
	if client != nil {
		return client.Disconnect(ctx)
	}
	return nil
}
