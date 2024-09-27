package storage

import (
	"context"

	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/feichai0017/notion-like/Server/internal/config"
	"github.com/minio/minio-go/v7"
)

var s3Client *s3.Client

func InitS3Client(cfg *config.Config) error {
	awsCfg, err := awsConfig.LoadDefaultConfig(context.TODO(), awsConfig.WithRegion(cfg.AWSRegion))
	if err != nil {
		return err
	}

	s3Client = s3.NewFromConfig(awsCfg)
	return nil
}

func SyncToS3(sourceBucket, sourceObject, destBucket, destObject string) error {
	// 从MinIO获取对象
	minioObj, err := GetFile(sourceBucket, sourceObject)
	if err != nil {
		return err
	}
	defer minioObj.Close()

	// 上传到S3
	_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: &destBucket,
		Key:    &destObject,
		Body:   minioObj,
	})

	return err
}

func SyncAllToS3() error {
	// 遍历所有MinIO存储桶和对象
	buckets, err := minioClient.ListBuckets(context.Background())
	if err != nil {
		return err
	}

	for _, bucket := range buckets {
		objects := minioClient.ListObjects(context.Background(), bucket.Name, minio.ListObjectsOptions{})
		for object := range objects {
			if object.Err != nil {
				return object.Err
			}

			err := SyncToS3(bucket.Name, object.Key, bucket.Name, object.Key)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
