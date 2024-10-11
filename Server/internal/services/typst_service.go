package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

type TypstCompileRequest struct {
	Typst string `json:"typst"`
}

type TypstCompileResponse struct {
	Status   string `json:"status"`
	Progress int    `json:"progress"`
	Message  string `json:"message"`
	PdfData  string `json:"pdfData,omitempty"`
}

type TypstService struct{}

func NewTypstService() *TypstService {
	return &TypstService{}
}

func (s *TypstService) CompileTypst(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TypstCompileRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	pdfBytes, err := s.compileTypst(req.Typst)
	if err != nil {
		log.Printf("Error compiling Typst: %v", err)
		sendJSONResponse(w, CompileResponse{
			Status:   "error",
			Progress: 0,
			Message:  fmt.Sprintf("Failed to compile Typst: %v", err),
		})
		return
	}

	// Encode PDF to base64
	pdfBase64 := base64.StdEncoding.EncodeToString(pdfBytes)

	sendJSONResponse(w, CompileResponse{
		Status:   "success",
		Progress: 100,
		Message:  "Typst compiled successfully",
		PdfData:  pdfBase64,
	})
}

func (s *TypstService) compileTypst(typstContent string) ([]byte, error) {
	tmpDir, err := os.MkdirTemp("", "typst-")
	if err != nil {
		return nil, fmt.Errorf("failed to create temporary directory: %w", err)
	}
	defer os.RemoveAll(tmpDir)

	typstFile := filepath.Join(tmpDir, "document.typ")
	err = os.WriteFile(typstFile, []byte(typstContent), 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to write Typst file: %w", err)
	}

	pdfFile := filepath.Join(tmpDir, "document.pdf")
	cmd := exec.Command("typst", "compile", typstFile, pdfFile)
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	err = cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("failed to compile Typst document: %w\nStdout: %s\nStderr: %s", err, outBuf.String(), errBuf.String())
	}

	pdfBytes, err := os.ReadFile(pdfFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read compiled PDF: %w", err)
	}

	return pdfBytes, nil
}
