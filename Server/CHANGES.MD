# Changes Log

## [Unreleased]

### Added
- Implemented S3 synchronization in `internal/storage/s3.go`
- Added AWS SDK configuration in `go.mod`

### Changed
- Updated Go version to 1.22.0 in `go.mod`
- Refactored AWS config import in `internal/storage/s3.go` to avoid naming conflicts

### Fixed
- Resolved import conflicts in `internal/storage/s3.go`

## [1.0.0] - YYYY-MM-DD
- Initial release of the Notion-like application