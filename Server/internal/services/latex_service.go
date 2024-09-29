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

type CompileRequest struct {
	LaTeX string `json:"latex"`
}

type CompileResponse struct {
	Status   string `json:"status"`
	Progress int    `json:"progress"`
	Message  string `json:"message"`
	PdfData  string `json:"pdfData,omitempty"`
}

type LatexService struct{}

func NewLatexService() *LatexService {
	return &LatexService{}
}

func (s *LatexService) CompileLatex(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CompileRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	pdfBytes, err := s.compileLaTeX(req.LaTeX)
	if err != nil {
		log.Printf("Error compiling LaTeX: %v", err)
		sendJSONResponse(w, CompileResponse{
			Status:   "error",
			Progress: 0,
			Message:  fmt.Sprintf("Failed to compile LaTeX: %v", err),
		})
		return
	}

	// Encode PDF to base64
	pdfBase64 := base64.StdEncoding.EncodeToString(pdfBytes)

	sendJSONResponse(w, CompileResponse{
		Status:   "success",
		Progress: 100,
		Message:  "LaTeX compiled successfully",
		PdfData:  pdfBase64,
	})
}

func (s *LatexService) compileLaTeX(latexContent string) ([]byte, error) {
	tmpDir, err := os.MkdirTemp("", "latex-")
	if err != nil {
		return nil, fmt.Errorf("failed to create temporary directory: %w", err)
	}
	defer os.RemoveAll(tmpDir)

	texFile := filepath.Join(tmpDir, "document.tex")
	err = os.WriteFile(texFile, []byte(latexContent), 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to write LaTeX file: %w", err)
	}

	cmd := exec.Command("pdflatex", "-interaction=nonstopmode", "-output-directory", tmpDir, texFile)
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	err = cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("failed to compile LaTeX document: %w\nStdout: %s\nStderr: %s", err, outBuf.String(), errBuf.String())
	}

	pdfFile := filepath.Join(tmpDir, "document.pdf")
	pdfBytes, err := os.ReadFile(pdfFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read compiled PDF: %w", err)
	}

	return pdfBytes, nil
}

func sendJSONResponse(w http.ResponseWriter, response CompileResponse) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
