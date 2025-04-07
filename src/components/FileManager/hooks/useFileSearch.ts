// useFileSearch.ts - Hook for file search functionality
import { useState, useCallback } from "react";
import { Folder, FileSearchOption } from "../types/types";

/**
 * Custom hook for file search functionality
 */
export const useFileSearch = (fileStructure: Folder[]) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchBoxOptions, setSearchBoxOptions] = useState<FileSearchOption[]>(
    []
  );

  /**
   * Finds folders and files by partial name match
   */
  const findItemsByPartialName = useCallback(
    (folders: Folder[], partialName: string): FileSearchOption[] => {
      const folderSuggestions: FileSearchOption[] = [];
      const fileSuggestions: FileSearchOption[] = [];

      // Recursive function to search through the folder structure
      const search = (items: Folder[]) => {
        for (const item of items) {
          if (item.name.toLowerCase().includes(partialName.toLowerCase())) {
            if (item.file_name) {
              fileSuggestions.push({
                id: item.id,
                name: item.name,
                type: "file",
                file_name: item.file_name,
              });
            } else {
              folderSuggestions.push({
                id: item.id,
                name: item.name,
                type: "folder",
              });
            }
          }

          // Recursively search sub-folders
          if (item.sub_classifications && item.sub_classifications.length > 0) {
            search(item.sub_classifications);
          }
        }
      };

      // Start search from the root folders
      search(folders);

      // Return folders first, then files
      return [...folderSuggestions, ...fileSuggestions];
    },
    []
  );

  /**
   * Handler for search input changes
   */
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      if (!value.trim()) {
        setSearchBoxOptions([]);
        return;
      }

      // Search for matching items
      const matchingItems = findItemsByPartialName(fileStructure, value);
      setSearchBoxOptions(matchingItems);
    },
    [fileStructure, findItemsByPartialName]
  );

  /**
   * Finds a folder by its name
   */
  const findFolderByName = useCallback(
    (
      folders: Folder[],
      folderName: string
    ): { folder: Folder | null; parentFolder: Folder | null } => {
      for (const folder of folders) {
        if (folder.name === folderName) {
          return { folder, parentFolder: null };
        }

        if (
          folder.sub_classifications &&
          folder.sub_classifications.length > 0
        ) {
          for (const subFolder of folder.sub_classifications) {
            if (subFolder.name === folderName) {
              return { folder: subFolder, parentFolder: folder };
            }

            // Recursively search deeper
            if (
              subFolder.sub_classifications &&
              subFolder.sub_classifications.length > 0
            ) {
              const result = findFolderByName([subFolder], folderName);
              if (result.folder) return result;
            }
          }
        }
      }

      return { folder: null, parentFolder: null };
    },
    []
  );

  return {
    searchValue,
    setSearchValue,
    searchBoxOptions,
    setSearchBoxOptions,
    handleSearchChange,
    findFolderByName,
  };
};
