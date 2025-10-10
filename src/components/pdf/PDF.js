import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Storage as EmbedIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { pdfService } from "../../services/pdfService";
import ConfirmDialog from "../ui/ConfirmDialog";
import AlertDialog from "../ui/AlertDialog";
import { useMaterialDialogs } from "../../hooks/useDialog";
import { formatDate } from "../../utils/dateUtils";

const PDF = () => {
  // Upload modal states
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [doi, setDoi] = useState("");
  const [pmid, setPmid] = useState("");
  const [tags, setTags] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // PDF table states
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // View content modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState("");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Material-UI dialogs
  const {
    confirmDialog,
    alertDialog,
    showConfirm,
    hideConfirm,
    handleConfirm,
    showAlert,
    hideAlert,
  } = useMaterialDialogs();

  const handleOpenModal = () => {
    setOpenModal(true);
    setSelectedFile(null);
    setDoi("");
    setPmid("");
    setTags("");
    setUploadError("");
    setIsUploading(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
    setDoi("");
    setPmid("");
    setTags("");
    setUploadError("");
    setIsUploading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setUploadError("");
      } else {
        setUploadError("Please select a valid PDF file.");
        setSelectedFile(null);
      }
    }
  };

  // Fetch PDFs from backend
  const fetchPdfs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await pdfService.getAllPdfs();
      setPdfs(data);
    } catch (error) {
      setError("Failed to load PDFs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load PDFs on component mount
  useEffect(() => {
    fetchPdfs();
  }, []);

  // Handle view PDF content
  const handleViewPdf = async (pdfId) => {
    try {
      setContentLoading(true);
      setContentError("");
      const pdfData = await pdfService.getPdfById(pdfId);
      setSelectedPdf(pdfData);
      setViewModalOpen(true);
    } catch (error) {
      setContentError("Failed to load PDF content. Please try again.");
    } finally {
      setContentLoading(false);
    }
  };

  // Handle delete PDF
  const handleDeletePdf = async (pdfId, fileName) => {
    showConfirm(
      "Delete PDF",
      `Are you sure you want to delete "${fileName}"?`,
      async () => {
        try {
          await pdfService.deletePdf(pdfId);
          showAlert("Success", "PDF deleted successfully!", "success");
          fetchPdfs(); // Refresh the list
        } catch (error) {
          showAlert(
            "Error",
            "Failed to delete PDF. Please try again.",
            "error"
          );
        }
      },
      "error"
    );
  };

  // Handle embed PDF
  const handleEmbedPdf = async (pdfId, fileName) => {
    try {
      await pdfService.embedPdf(pdfId);
      showAlert(
        "Success",
        `PDF "${fileName}" embedded successfully!`,
        "success"
      );
      fetchPdfs(); // Refresh the list to update the embed status
    } catch (error) {
      showAlert("Error", "Failed to embed PDF. Please try again.", "error");
    }
  };

  // Handle successful upload
  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError("Please select a PDF file.");
      return;
    }
    if (!doi.trim()) {
      setUploadError("Please enter a DOI.");
      return;
    }
    // pmid is optional; tags optional. If provided, validate lightly.
    if (pmid && !/^[0-9]+$/.test(pmid.trim())) {
      setUploadError("PMID must be numeric if provided.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");

      // Create FormData to send file and DOI
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("doi", doi);
      if (pmid.trim()) formData.append("pmid", pmid.trim());
      if (tags.trim()) formData.append("tags", tags.trim());

      // Use pdfService to upload the PDF
      const result = await pdfService.uploadPdf(formData);

      // Show success message with extracted content info
      showAlert(
        "Upload Successful",
        `PDF uploaded successfully!\n\nFile: ${result.fileName}\nDOI: ${
          result.doi
        }\nContent extracted: ${result.mainContent ? "Yes" : "No"}`,
        "success"
      );

      handleCloseModal();

      // Refresh the PDF list
      fetchPdfs();
    } catch (error) {
      setUploadError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated data
  const paginatedPdfs = pdfs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <style>
        {`
          @keyframes scrollText {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(var(--scroll-distance, 0px));
            }
          }
        `}
      </style>
      <Container maxWidth={false} sx={{ width: "90%", mx: "auto" }}>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PdfIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
            <Typography variant="h4" gutterBottom>
              PDF Management
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create, view, and manage PDF documents. Generate reports and
            download existing PDFs.
          </Typography>

          {/* Action Buttons Section */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{ mb: 2 }}
            >
              Add PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchPdfs}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              Refresh
            </Button>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* PDF Table */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ width: "100%" }}>
              <Table stickyHeader sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>PMID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>DOI</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Embedded</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Created At
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Updated At
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : pdfs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No PDFs found. Upload your first PDF!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPdfs.map((pdf) => (
                      <TableRow key={pdf.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {pdf.pmid || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pdf.doi || "N/A"}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pdf.is_embed ? "Yes" : "No"}
                            size="small"
                            variant="outlined"
                            color={pdf.is_embed ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(pdf.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(pdf.updatedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View Content">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewPdf(pdf.id)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Embed PDF">
                              <IconButton
                                size="small"
                                color="secondary"
                                onClick={() =>
                                  handleEmbedPdf(
                                    pdf.id,
                                    pdf.fileName || pdf.filename
                                  )
                                }
                                disabled={pdf.is_embed}
                              >
                                <EmbedIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete PDF">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleDeletePdf(
                                    pdf.id,
                                    pdf.fileName || pdf.filename
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {!loading && pdfs.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={pdfs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count}`
                }
              />
            )}
          </Paper>
        </Paper>

        {/* Add PDF Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="add-pdf-modal-title"
          aria-describedby="add-pdf-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              maxWidth: "90vw",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2" id="add-pdf-modal-title">
                Add New PDF
              </Typography>
              <IconButton onClick={handleCloseModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Error Alert */}
            {uploadError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {uploadError}
              </Alert>
            )}

            {/* PDF Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                PDF Upload
              </Typography>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: selectedFile ? "success.main" : "grey.300",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  backgroundColor: selectedFile ? "success.50" : "grey.50",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.50",
                  },
                }}
                onClick={() =>
                  document.getElementById("pdf-file-input").click()
                }
              >
                <input
                  id="pdf-file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <UploadIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="body1" gutterBottom>
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload PDF file"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedFile
                    ? "File selected successfully"
                    : "Drag and drop or click to browse"}
                </Typography>
              </Box>
            </Box>

            {/* DOI / PMID / Tags Input Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Metadata
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="DOI"
                  variant="outlined"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="e.g., 10.1000/182"
                  helperText="Required"
                />
                <TextField
                  fullWidth
                  label="PMID"
                  variant="outlined"
                  value={pmid}
                  onChange={(e) => setPmid(e.target.value)}
                  placeholder="e.g., 12345678"
                  helperText="Optional, numeric"
                />
              </Box>
              <TextField
                fullWidth
                label="Tags"
                variant="outlined"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='e.g., "[{"Stage of Menopause":"Menopause"}{"Symptom Categories":"Musculoskeletal"}]"'
              />
            </Box>

            {/* Modal Actions */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedFile || !doi.trim() || isUploading}
                startIcon={
                  isUploading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {isUploading ? "Uploading..." : "Upload PDF"}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* View PDF Content Modal */}
        <Modal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          aria-labelledby="view-pdf-modal-title"
          aria-describedby="view-pdf-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 800,
              maxWidth: "90vw",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2" id="view-pdf-modal-title">
                PDF Content
              </Typography>
              <IconButton onClick={() => setViewModalOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Error Alert */}
            {contentError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {contentError}
              </Alert>
            )}

            {/* Content Loading */}
            {contentLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : selectedPdf ? (
              <Box>
                {/* PDF Info */}
                <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    File Information
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Filename
                      </Typography>
                      <Typography variant="body1">
                        {selectedPdf.fileName || selectedPdf.filename}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        DOI
                      </Typography>
                      <Typography variant="body1">
                        {selectedPdf.doi || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Embedded
                      </Typography>
                      <Typography variant="body1">
                        {selectedPdf.is_embed ? "Yes" : "No"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedPdf.createdAt)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Updated At
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedPdf.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* PDF Content */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Extracted Content
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: "grey.50",
                      maxHeight: 400,
                      overflow: "auto",
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedPdf.content ? (
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{ whiteSpace: "pre-wrap", margin: 0 }}
                      >
                        {selectedPdf.content}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No content extracted from this PDF.
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No PDF data available.
              </Typography>
            )}

            {/* Modal Actions */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Material-UI Dialogs */}
        <ConfirmDialog
          open={confirmDialog.open}
          onClose={hideConfirm}
          onConfirm={handleConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          severity={confirmDialog.severity}
        />

        <AlertDialog
          open={alertDialog.open}
          onClose={hideAlert}
          title={alertDialog.title}
          message={alertDialog.message}
          severity={alertDialog.severity}
        />
      </Container>
    </>
  );
};

export default PDF;
