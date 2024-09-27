package storage

import (
	"context"
	"fmt"
	"io"

	"github.com/feichai0017/notion-like/Server/internal/config"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var minioClient *minio.Client

func InitMinioClient(cfg *config.Config) error {
	var err error
	minioClient, err = minio.New(cfg.MinioEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.MinioAccessKey, cfg.MinioSecretKey, ""),
		Secure: false,
	})
	return err
}

func UploadFile(bucketName, objectName string, reader io.Reader, objectSize int64) error {
	ctx := context.Background()

	// 确保存储桶存在
	err := minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := minioClient.BucketExists(ctx, bucketName)
		if errBucketExists == nil && exists {
			fmt.Printf("Bucket %s already exists\n", bucketName)
		} else {
			return err
		}
	}

	// 上传文件
	_, err = minioClient.PutObject(ctx, bucketName, objectName, reader, objectSize, minio.PutObjectOptions{ContentType: "application/octet-stream"})
	return err
}

func GetFile(bucketName, objectName string) (*minio.Object, error) {
	return minioClient.GetObject(context.Background(), bucketName, objectName, minio.GetObjectOptions{})
}

func DeleteFile(bucketName, objectName string) error {
	return minioClient.RemoveObject(context.Background(), bucketName, objectName, minio.RemoveObjectOptions{})
}
