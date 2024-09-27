package services

import (
	"errors"

	"github.com/feichai0017/notion-like/Server/internal/db"
	"github.com/feichai0017/notion-like/Server/internal/models"
	"github.com/feichai0017/notion-like/Server/pkg/utils"
)

func CreateUser(username, email, password string) (*models.User, error) {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username: username,
		Email:    email,
		Password: hashedPassword,
	}

	if err := db.DB.Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	if err := db.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func ValidateUser(username, password string) (*models.User, error) {
	user, err := GetUserByUsername(username)
	if err != nil {
		return nil, err
	}
	if !utils.CheckPasswordHash(password, user.Password) {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}

func GenerateToken(userID uint) (string, error) {
	token, err := utils.GenerateToken(userID)
	if err != nil {
		return "", err
	}

	// 这里可以添加额外的逻辑，比如将令牌存储到数据库或缓存中

	return token, nil
}

func ValidateToken(tokenString string) (*utils.Claims, error) {
	claims, err := utils.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	// 检查用户是否仍然存在于数据库中
	user := &models.User{}
	if err := db.DB.First(user, claims.UserID).Error; err != nil {
		return nil, errors.New("user not found")
	}

	return claims, nil
}
