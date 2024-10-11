package services

import (
	"bytes"
	"io"

	"github.com/feichai0017/notion-like/Server/internal/db"
	"github.com/feichai0017/notion-like/Server/internal/models"
	"github.com/feichai0017/notion-like/Server/internal/storage"
	"github.com/google/uuid"
)

func CreateDocument(userID uint, title string, content []byte, format string) (*models.Document, error) {
	// 生成唯一的对象存储键
	objectKey := generateUniqueKey()

	// 上传文档内容到MinIO
	bucketName := "documents"
	err := storage.UploadFile(bucketName, objectKey, bytes.NewReader(content), int64(len(content)))
	if err != nil {
		return nil, err
	}

	// 创建文档记录
	document := &models.Document{
		UserID:           userID,
		Title:            title,
		ObjectStorageKey: objectKey,
		Format:           format,
	}

	if err := db.DB.Create(document).Error; err != nil {
		// 如果数据库创建失败，删除已上传的文件
		storage.DeleteFile(bucketName, objectKey)
		return nil, err
	}

	return document, nil
}

func GetDocumentContent(document *models.Document) ([]byte, error) {
	obj, err := storage.GetFile("documents", document.ObjectStorageKey)
	if err != nil {
		return nil, err
	}
	defer obj.Close()

	return io.ReadAll(obj)
}

func GetDocument(userID uint, documentID string) (*models.Document, error) {
	var document models.Document
	if err := db.DB.Where("id = ? AND user_id = ?", documentID, userID).First(&document).Error; err != nil {
		return nil, err
	}
	return &document, nil
}

func GetUserDocuments(userID uint) ([]models.Document, error) {
	var documents []models.Document
	if err := db.DB.Where("user_id = ?", userID).Find(&documents).Error; err != nil {
		return nil, err
	}
	return documents, nil
}

func UpdateDocument(document *models.Document, title string, content []byte, format string) error {
	// 更新MinIO中的文档内容
	err := storage.UploadFile("documents", document.ObjectStorageKey, bytes.NewReader(content), int64(len(content)))
	if err != nil {
		return err
	}

	// 更新数据库中的文档记录
	document.Title = title
	document.Format = format
	return db.DB.Save(document).Error
}

func DeleteDocument(document *models.Document) error {
	// 从MinIO中删除文档内容
	err := storage.DeleteFile("documents", document.ObjectStorageKey)
	if err != nil {
		return err
	}

	// 从数据库中删除文档记录
	return db.DB.Delete(document).Error
}

func generateUniqueKey() string {
	// 实现生成唯一键的逻辑，例如使用 UUID
	return uuid.New().String()
}
