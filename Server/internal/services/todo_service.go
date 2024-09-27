package services

import (
	"github.com/feichai0017/notion-like/Server/internal/db"
	"github.com/feichai0017/notion-like/Server/internal/models"
)

func CreateTodo(userID uint, content string) (*models.Todo, error) {
	todo := &models.Todo{
		UserID:  userID,
		Content: content,
	}

	if err := db.DB.Create(todo).Error; err != nil {
		return nil, err
	}

	return todo, nil
}

func GetUserTodos(userID uint) ([]models.Todo, error) {
	var todos []models.Todo
	if err := db.DB.Where("user_id = ?", userID).Find(&todos).Error; err != nil {
		return nil, err
	}
	return todos, nil
}

func UpdateTodo(todo *models.Todo, content string, isCompleted bool) error {
	todo.Content = content
	todo.IsCompleted = isCompleted
	return db.DB.Save(todo).Error
}

func DeleteTodo(todo *models.Todo) error {
	return db.DB.Delete(todo).Error
}
