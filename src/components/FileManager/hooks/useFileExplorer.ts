// src/components/FileManager/hooks/useFileExplorer.ts
import { useState, useEffect, useCallback } from "react";
import { Folder } from "../types/types";
import { fileService } from "@/services/fileService";
import { toast } from "react-toastify";

/**
 * Custom hook for file and folder exploration functionality
 */
export const useFileExplorer = () => {
  const [treeView, setTreeView] = useState<Folder[]>([]);
  const [navigationArr, setNavigationArr] = useState<Folder[]>([]);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder>({} as Folder);
  const [arrowClicked, setArrowClicked] = useState<boolean>(false);
  const [arrowClickedCount, setArrowClickedCount] = useState<number>(2);
  const [lastFolder, setLastFolder] = useState<Folder | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Adds nodeId to all folders in the file tree
   */
  const addNodeId = useCallback((data: Folder[], prefix = ""): Folder[] => {
    return data.map((item, index) => {
      const newItem = { ...item, nodeId: `${prefix}${index}` };
      if (newItem.sub_classifications) {
        newItem.sub_classifications = addNodeId(
          newItem.sub_classifications,
          `${newItem.nodeId}-`
        );
      }
      return newItem;
    });
  }, []);

  /**
   * Fetches file data from the API
   */
  const getData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Get folder tree structure for the sidebar
      const folderTree = await fileService.getAllFolders();

      // Add nodeId for TreeView component
      const updatedData = addNodeId(folderTree);
      setTreeView(updatedData);

      // If no folder is selected yet, select the root folder
      if (!selectedFolder?.id && updatedData.length > 0) {
        setSelectedFolder(updatedData[0]);
      }
    } catch (error) {
      console.error("Error fetching file data:", error);
      toast.error("Failed to load folders");
    } finally {
      setIsLoading(false);
    }
  }, [addNodeId, selectedFolder?.id]);

  /**
   * Fetches contents of a specific folder
   */
  const getFolderContents = useCallback(
    async (folderId?: number): Promise<void> => {
      try {
        setIsLoading(true);
        const contents = await fileService.getFolderContents(folderId);

        // Update the selected folder with its contents
        if (selectedFolder?.id === folderId) {
          setSelectedFolder({
            ...selectedFolder,
            sub_classifications: contents,
          });
        }
      } catch (error) {
        console.error("Error fetching folder contents:", error);
        toast.error("Failed to load folder contents");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedFolder]
  );

  /**
   * Find the path to a folder by its ID
   */
  const findFolderById = useCallback(
    (
      folders: Folder[],
      targetId: number,
      targetLevel?: number,
      path: Folder[] = []
    ): Folder[] | null => {
      for (const folder of folders) {
        const newPath = path.length === 0 ? [folder] : [...path, folder];
        if (
          folder.id === targetId &&
          (!targetLevel || folder.level === targetLevel)
        ) {
          return newPath;
        }
        if (
          folder.sub_classifications &&
          folder.sub_classifications.length > 0
        ) {
          const found = findFolderById(
            folder.sub_classifications,
            targetId,
            targetLevel,
            newPath
          );
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  /**
   * Handles "back" navigation
   */
  const handleDeleteLast = useCallback((): void => {
    setNavigationArr((prev) => {
      const newArray = [...prev];
      newArray.pop();
      return newArray;
    });
  }, []);

  // Initial data loading
  useEffect(() => {
    getData();
  }, [getData]);

  // Load folder contents when selected folder changes
  useEffect(() => {
    if (selectedFolder?.id) {
      getFolderContents(selectedFolder.id);
    }
  }, [selectedFolder?.id, getFolderContents]);

  // Update navigation array when selected folder changes
  useEffect(() => {
    if (selectedFolder?.id && !arrowClicked) {
      setNavigationArr((prev) => [...prev, selectedFolder]);
    }
  }, [selectedFolder?.id, arrowClicked]);

  // Update folder path when selected folder changes
  useEffect(() => {
    if (selectedFolder?.id) {
      const folderPathArray = findFolderById(
        treeView,
        selectedFolder.id,
        selectedFolder.level
      );
      if (folderPathArray) {
        setFolderPath(folderPathArray);
      }
    }
  }, [treeView, selectedFolder?.id, findFolderById]);

  return {
    // State
    treeView,
    setTreeView,
    navigationArr,
    setNavigationArr,
    folderPath,
    setFolderPath,
    selectedFolder,
    setSelectedFolder,
    arrowClicked,
    setArrowClicked,
    arrowClickedCount,
    setArrowClickedCount,
    lastFolder,
    selectedName,
    setSelectedName,
    isLoading,

    // Functions
    getData,
    getFolderContents,
    handleDeleteLast,
    findFolderById,
  };
};
