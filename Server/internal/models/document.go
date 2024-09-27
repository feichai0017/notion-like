package models

import (
	"gorm.io/gorm"
)

type Document struct {
	gorm.Model
	UserID           uint   `gorm:"not null"`
	Title            string `gorm:"not null"`
	ObjectStorageKey string `gorm:"not null"`
	User             User   `gorm:"foreignKey:UserID"`
}
