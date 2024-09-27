package models

import (
	"gorm.io/gorm"
)

type Todo struct {
	gorm.Model
	UserID      uint   `gorm:"not null"`
	Content     string `gorm:"not null"`
	IsCompleted bool   `gorm:"default:false"`
	User        User   `gorm:"foreignKey:UserID"`
}
