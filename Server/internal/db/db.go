package db

import (
	"fmt"
	"log"

	"github.com/feichai0017/notion-like/Server/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(cfg *config.Config) error {
	var err error
	fmt.Println("Database URL:", cfg.DatabaseURL)
	DB, err = gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		return err
	}

	// 检查连接
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}

	// 测试连接
	err = sqlDB.Ping()
	if err != nil {
		return err
	}

	log.Println("Successfully connected to the database")

	// 自动迁移模型
	// err = DB.AutoMigrate(&models.User{}, &models.Document{}, &models.Todo{})
	// if err != nil {
	//     log.Printf("Auto migration failed: %v", err)
	//     return err
	// }

	return nil
}
