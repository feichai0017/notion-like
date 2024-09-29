package handlers

import (
	"github.com/feichai0017/notion-like/Server/internal/services"
	"github.com/gin-gonic/gin"
)

func CompileLatex(c *gin.Context) {
	latexService := services.NewLatexService()
	latexService.CompileLatex(c.Writer, c.Request)
}
