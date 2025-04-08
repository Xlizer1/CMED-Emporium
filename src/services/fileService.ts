// src/services/fileService.ts
import axios from "axios";
import { Folder } from "@/components/FileManager/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

/**
 * Service for handling file uploads and file/folder operations
 */
export const fileService = {
  /**
   * Upload a file to the specified folder
   * @param file The file to upload
   * @param folderId The folder ID to upload to
   * @returns The uploaded file metadata
   */
  uploadFile: async (file: File, folderId: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId.toString());

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  /**
   * Upload multiple files to the specified folder
   * @param files Array of files to upload
   * @param folderId The folder ID to upload to
   * @returns Array of uploaded file metadata
   */
  uploadMultipleFiles: async (files: File[], folderId: number) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("folderId", folderId.toString());

    const response = await axios.post(`${API_URL}/upload/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  /**
   * Create a new folder
   * @param name Folder name
   * @param parentFolderId Parent folder ID (optional)
   * @returns The created folder metadata
   */
  createFolder: async (name: string, parentFolderId?: number) => {
    const response = await axios.post(`${API_URL}/folders`, {
      name,
      parentFolderId: parentFolderId || null,
    });

    return response.data;
  },

  /**
   * Get folders and files for a specific folder
   * @param folderId Folder ID to fetch contents for
   * @returns Folder contents (subfolders and files)
   */
  getFolderContents: async (folderId?: number) => {
    const response = await axios.get(
      `${API_URL}/folders/${folderId || "root"}/contents`
    );
    return response.data;
  },

  /**
   * Delete a file or folder
   * @param item The file or folder to delete
   * @returns Success message
   */
  deleteItem: async (item: Folder) => {
    const isFile = !!item.file_name;
    const endpoint = isFile ? "files" : "folders";
    const id = item.id;

    const response = await axios.delete(`${API_URL}/${endpoint}/${id}`);
    return response.data;
  },

  /**
   * Download a file
   * @param fileId The ID of the file to download
   * @returns Blob of the file
   */
  downloadFile: async (fileId: number) => {
    const response = await axios.get(`${API_URL}/files/${fileId}/download`, {
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Get all folders (for folder tree)
   * @returns Folder tree structure
   */
  getAllFolders: async () => {
    try {
      const response = await axios.get(`${API_URL}/folders/tree`);
      console.log("Folder tree response:", response.data);
      return response.data.tree || [];
    } catch (error) {
      console.error("Error fetching folder tree:", error);
      return [];
    }
  },
};
