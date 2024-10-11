package api

import (
	"github.com/feichai0017/notion-like/Server/internal/api/handlers"
	"github.com/feichai0017/notion-like/Server/internal/api/middlewares"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// 使用 CORS 中间件
	r.Use(middlewares.CORSMiddleware())

	// 公共路由
	public := r.Group("/api")
	{
		public.POST("/register", handlers.Register)
		public.POST("/login", handlers.Login)
		public.POST("/compile-latex", handlers.CompileLatex)
		public.POST("/compile-typst", handlers.CompileTypst)
	}

	// 需要认证的路由
	protected := r.Group("/api")
	protected.Use(middlewares.AuthMiddleware())
	{
		// 文档路由
		protected.GET("/documents", handlers.GetDocuments)
		protected.GET("/documents/:id", handlers.GetDocument)
		protected.POST("/documents", handlers.CreateDocument)
		protected.PUT("/documents/:id", handlers.UpdateDocument)
		protected.DELETE("/documents/:id", handlers.DeleteDocument)

		// 待办事项路由
		protected.GET("/todos", handlers.GetTodos)
		protected.GET("/todos/:id", handlers.GetTodo)
		protected.POST("/todos", handlers.CreateTodo)
		protected.PUT("/todos/:id", handlers.UpdateTodo)
		protected.DELETE("/todos/:id", handlers.DeleteTodo)
	}

	return r
}
