package handlers

import (
	"github.com/feichai0017/notion-like/Server/internal/services"
	"github.com/gin-gonic/gin"
)

func CompileTypst(c *gin.Context) {
	typstService := services.NewTypstService()
	typstService.CompileTypst(c.Writer, c.Request)
}
