// useFileExplorer.ts - Custom hook for file tree management
import { useState, useEffect, useCallback } from "react";
import { Folder } from "../types/types";

// Sample data for demo purposes
const sampleTreeData: Folder[] = [
  {
    id: 1,
    name: "Documents",
    level: 0,
    nodeId: "1",
    sub_classifications: [
      {
        id: 2,
        name: "Reports",
        level: 1,
        nodeId: "1-0",
        sub_classifications: [
          {
            id: 4,
            name: "Annual Report.pdf",
            level: 2,
            nodeId: "1-0-0",
            file_name: "Annual Report.pdf",
          },
        ],
      },
      {
        id: 3,
        name: "Projects",
        level: 1,
        nodeId: "1-1",
        sub_classifications: [],
      },
    ],
  },
  {
    id: 5,
    name: "Images",
    level: 0,
    nodeId: "2",
    sub_classifications: [
      {
        id: 6,
        name: "Logo.png",
        level: 1,
        nodeId: "2-0",
        file_name: "Logo.png",
      },
    ],
  },
];

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
      // In a real application, you would fetch data from an API
      // For now, use sample data
      const updatedData = addNodeId(sampleTreeData);
      setTreeView(updatedData);
    } catch (error) {
      console.error("Error fetching file data:", error);
      // Handle error (show toast notification, etc.)
    }
  }, [addNodeId]);

  /**
   * Finds the last folder in each tree branch
   */
  const getLastFolderFromObjects = useCallback(
    (objects: Folder[]): Folder | null => {
      let lastFolder: Folder | null = null;

      objects.forEach((obj) => {
        const folder = getLastFolder(obj);
        if (
          folder &&
          (!lastFolder ||
            (folder.sub_classifications?.length || 0) >
              (lastFolder.sub_classifications?.length || 0))
        ) {
          lastFolder = folder;
        }
      });

      return lastFolder;
    },
    []
  );

  /**
   * Helper function to find the last folder in a tree branch
   */
  const getLastFolder = (obj: Folder): Folder | null => {
    if (!obj.sub_classifications || obj.sub_classifications.length === 0) {
      return obj.file_name ? null : obj;
    } else {
      for (let i = obj.sub_classifications.length - 1; i >= 0; i--) {
        const sub = obj.sub_classifications[i];
        if (!sub.file_name) {
          if (obj.level === 2) {
            obj.sub_classifications.reverse();
          }
          const lastSubFolder = getLastFolder(sub);
          if (lastSubFolder) {
            return lastSubFolder;
          }
        }
      }
    }
    return null;
  };

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

  // Set initial selected folder
  useEffect(() => {
    if (treeView?.length > 0) {
      setSelectedFolder(treeView[0]);
    }
  }, [treeView?.length]);

  // Update navigation array when selected folder changes
  useEffect(() => {
    if (selectedFolder?.id && !arrowClicked) {
      setNavigationArr((prev) => [...prev, selectedFolder]);
    }
  }, [selectedFolder?.id, arrowClicked]);

  // Set last folder and folder path
  useEffect(() => {
    const lastFolder = getLastFolderFromObjects(treeView);
    setLastFolder(lastFolder);
  }, [treeView, getLastFolderFromObjects]);

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
        setSelectedFolder(folderPathArray[folderPathArray?.length - 1]);
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

    // Functions
    getData,
    handleDeleteLast,
    findFolderById,
  };
};
