// src/components/FileManager/components/FileViewer.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { Folder } from "../types/types";
import { fileService } from "@/services/fileService";

interface FileViewerProps {
  open: boolean;
  onClose: () => void;
  file: Folder | null;
  onDownload: (file: Folder) => Promise<void>;
}

/**
 * Component for viewing file contents
 */
export const FileViewer: React.FC<FileViewerProps> = ({
  open,
  onClose,
  file,
  onDownload,
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get file extension
  const fileExtension = file?.file_name?.split(".").pop()?.toLowerCase() || "";

  // Determine content type
  const isImage = ["jpg", "jpeg", "png", "gif", "svg"].includes(fileExtension);
  const isPdf = fileExtension === "pdf";
  const isText = ["txt", "md", "json", "csv"].includes(fileExtension);
  const isDocument = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
    fileExtension
  );

  // Fetch file content when dialog opens
  useEffect(() => {
    const getFileContent = async () => {
      if (!file || !open) return;

      try {
        setLoading(true);
        setError(null);

        if (isText) {
          // For text files, we can display the content
          const response = await fileService.downloadFile(file.id);
          const text = await response.text();
          setFileContent(text);
        } else if (isImage || isPdf) {
          // For images and PDFs, we'll create a blob URL
          const response = await fileService.downloadFile(file.id);
          const url = URL.createObjectURL(response);
          setFileContent(url);
        } else {
          // For other file types, we'll just show metadata
          setFileContent(null);
        }
      } catch (err) {
        console.error("Error fetching file content:", err);
        setError(
          "Failed to load file content. Please try downloading the file instead."
        );
      } finally {
        setLoading(false);
      }
    };

    getFileContent();

    // Clean up blob URL when component unmounts
    return () => {
      if (fileContent && (isImage || isPdf)) {
        URL.revokeObjectURL(fileContent);
      }
    };
  }, [file, open, isImage, isPdf, isText]);

  // Handle download button click
  const handleDownload = () => {
    if (file) {
      onDownload(file);
    }
  };

  // Render appropriate content based on file type
  const renderContent = () => {
    if (loading) {
      return <LinearProgress />;
    }

    if (error) {
      return <Typography color="error">{error}</Typography>;
    }

    if (!fileContent && !isDocument) {
      return (
        <Typography>
          Preview not available for this file type. Please download to view.
        </Typography>
      );
    }

    if (isImage) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <img
            src={fileContent || ""}
            alt={file?.name || "Preview"}
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
          />
        </Box>
      );
    }

    if (isPdf) {
      return (
        <Box sx={{ height: "70vh", width: "100%" }}>
          <iframe
            src={`${fileContent}#toolbar=0`}
            width="100%"
            height="100%"
            title={file?.name || "PDF Preview"}
            style={{ border: "none" }}
          />
        </Box>
      );
    }

    if (isText) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            maxHeight: "70vh",
            overflow: "auto",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {fileContent}
        </Paper>
      );
    }

    if (isDocument) {
      return (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h6" gutterBottom>
            {file?.name}
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 2 }}>
            This file type requires external software to view.
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download File
          </Button>
        </Box>
      );
    }

    return null;
  };

  if (!file) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            maxWidth: "calc(100% - 72px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.name}
        </Typography>
        <Box>
          <IconButton onClick={handleDownload} title="Download">
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={onClose} title="Close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
