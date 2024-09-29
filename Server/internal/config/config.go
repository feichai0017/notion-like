package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL        string
	ServerPort         string
	JWTSecret          string
	MinioEndpoint      string
	MinioAccessKey     string
	MinioSecretKey     string
	AWSRegion          string
	AWSAccessKeyID     string
	AWSSecretAccessKey string
}

func Load() (*Config, error) {
	err := godotenv.Load("/Volumes/T7/my-projects/notion-like/Server/.env")
	if err != nil {
		return nil, err
	}

	return &Config{
		DatabaseURL:        os.Getenv("DATABASE_URL"),
		ServerPort:         os.Getenv("SERVER_PORT"),
		JWTSecret:          os.Getenv("JWT_SECRET"),
		MinioEndpoint:      os.Getenv("MINIO_ENDPOINT"),
		MinioAccessKey:     os.Getenv("MINIO_ACCESS_KEY"),
		MinioSecretKey:     os.Getenv("MINIO_SECRET_KEY"),
		AWSRegion:          os.Getenv("AWS_REGION"),
		AWSAccessKeyID:     os.Getenv("AWS_ACCESS_KEY_ID"),
		AWSSecretAccessKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
	}, nil
}
