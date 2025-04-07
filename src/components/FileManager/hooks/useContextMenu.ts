// useContextMenu.ts - Hook for managing context menu
import { useState } from "react";
import { Folder, MenuPosition } from "../types/types";

/**
 * Custom hook for managing the context menu
 */
export const useContextMenu = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    x: 0,
    y: 0,
    from_side_menu: false,
  });
  const [rightClickedItem, setRightClickedItem] = useState<Folder>(
    {} as Folder
  );

  /**
   * Handles right-click context menu
   */
  const handleContextMenu = (
    event: React.MouseEvent,
    item: Folder,
    from_side_menu = false
  ): void => {
    event.preventDefault();
    setMenuOpen(true);
    setRightClickedItem(item);
    setMenuPosition({
      x: event.clientX,
      y: event.clientY,
      from_side_menu,
    });
  };

  /**
   * Creates a context menu handler for the tree view
   */
  const createTreeContextMenuHandler =
    (folder: Folder) =>
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      handleContextMenu(
        event,
        {
          ...folder,
          treeFolder: true,
        },
        true
      );
    };

  /**
   * Creates a context menu handler for the parent folder
   */
  const createParentContextMenuHandler =
    (folder: Folder) =>
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      handleContextMenu(event, {
        ...folder,
        parentFolder: true,
      });
    };

  /**
   * Closes the context menu
   */
  const closeContextMenu = (): void => {
    setMenuOpen(false);
  };

  return {
    menuOpen,
    menuPosition,
    rightClickedItem,
    handleContextMenu,
    createTreeContextMenuHandler,
    createParentContextMenuHandler,
    closeContextMenu,
  };
};
