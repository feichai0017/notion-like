package db

import (
	"github.com/feichai0017/notion-like/Server/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(cfg *config.Config) error {
	var err error
	DB, err = gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		return err
	}

	// 自动迁移模型
	// DB.AutoMigrate(&models.User{}, &models.Document{}, &models.Todo{})

	return nil
}
