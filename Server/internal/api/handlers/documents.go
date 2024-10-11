package handlers

import (
	"net/http"

	"github.com/feichai0017/notion-like/Server/internal/services"
	"github.com/gin-gonic/gin"
)

func GetDocuments(c *gin.Context) {
	userID := c.GetUint("userID")
	documents, err := services.GetUserDocuments(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch documents"})
		return
	}
	c.JSON(http.StatusOK, documents)
}

func GetDocument(c *gin.Context) {
	userID := c.GetUint("userID")
	documentID := c.Param("id")

	document, err := services.GetDocument(userID, documentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	content, err := services.GetDocumentContent(document)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve document content"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":      document.ID,
		"title":   document.Title,
		"content": string(content),
		"format":  document.Format,
	})
}

func CreateDocument(c *gin.Context) {
	userID := c.GetUint("userID")
	var createData struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		Format  string `json:"format"`
	}

	if err := c.BindJSON(&createData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	document, err := services.CreateDocument(userID, createData.Title, []byte(createData.Content), createData.Format)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create document"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":     document.ID,
		"title":  document.Title,
		"format": document.Format,
	})
}

func UpdateDocument(c *gin.Context) {
	userID := c.GetUint("userID")
	documentID := c.Param("id")

	var updateData struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		Format  string `json:"format"`
	}

	if err := c.BindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	document, err := services.GetDocument(userID, documentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	err = services.UpdateDocument(document, updateData.Title, []byte(updateData.Content), updateData.Format)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update document"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Document updated successfully"})
}

func DeleteDocument(c *gin.Context) {
	userID := c.GetUint("userID")
	documentID := c.Param("id")

	document, err := services.GetDocument(userID, documentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	err = services.DeleteDocument(document)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete document"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Document deleted successfully"})
}
