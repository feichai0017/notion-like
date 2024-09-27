package main

import (
	"log"

	"github.com/feichai0017/notion-like/Server/internal/api"
	"github.com/feichai0017/notion-like/Server/internal/config"
	"github.com/feichai0017/notion-like/Server/internal/db"
)

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化数据库
	if err := db.Init(cfg); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// 设置路由
	r := api.SetupRouter()

	// 启动服务器
	log.Printf("Server is running on :%s", cfg.ServerPort)
	r.Run(":" + cfg.ServerPort)
}
