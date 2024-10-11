package models

import "time"

type Document struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	UserID           uint      `json:"user_id"`
	Title            string    `json:"title"`
	ObjectStorageKey string    `json:"object_storage_key"`
	Format           string    `json:"format"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}
