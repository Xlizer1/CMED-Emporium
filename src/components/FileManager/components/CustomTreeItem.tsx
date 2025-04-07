// CustomTreeItem.tsx - Custom TreeItem component for file explorer
import React, { forwardRef } from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Collapse, Typography, Box } from "@mui/material";
import { useTreeItem } from "@mui/x-tree-view";
import clsx from "clsx";
import FolderIcon from "@mui/icons-material/Folder";
import { Folder } from "../types/types";

// Props for the content component
interface CustomContentProps {
  classes: Record<string, string>;
  className?: string;
  label: React.ReactNode;
  nodeId: string;
  icon?: React.ReactNode;
  expansionIcon?: React.ReactNode;
  displayIcon?: React.ReactNode;
  onSelect: (params: { nodeId: string; label: React.ReactNode }) => void;
}

// Props for the custom tree item
interface CustomTreeItemProps {
  nodeId: string;
  label: React.ReactNode;
  onSelect: (folder: Folder) => void;
  onContextMenu: (folder: Folder, event: React.MouseEvent) => void;
  folder: Folder;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Simple transition component for tree item animation
 */
const TransitionComponent: React.FC<any> = (props) => {
  return <Collapse {...props} />;
};

/**
 * Custom content component for TreeItem
 */
const CustomContent = forwardRef<HTMLDivElement, CustomContentProps>(
  function CustomContent(props, ref) {
    const {
      classes,
      className,
      label,
      nodeId,
      icon: iconProp,
      expansionIcon,
      displayIcon,
      onSelect,
    } = props;

    const {
      disabled,
      expanded,
      selected,
      focused,
      handleExpansion,
      preventSelection,
    } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      preventSelection(event);
    };

    const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement>) => {
      handleExpansion(event);
    };

    const handleSelectionClick = () => {
      if (onSelect) {
        onSelect({ nodeId, label });
      }
    };

    return (
      <div
        className={clsx(className, classes?.root, {
          [classes?.expanded || ""]: expanded,
          [classes?.selected || ""]: selected,
          [classes?.focused || ""]: focused,
          [classes?.disabled || ""]: disabled,
        })}
        onMouseDown={handleMouseDown}
        ref={ref}
      >
        <div onClick={handleExpansionClick} className={classes?.iconContainer}>
          {icon ? (
            icon
          ) : (
            <FolderIcon
              style={{ marginLeft: "22px", color: "#F8D775", fontSize: "21px" }}
            />
          )}
        </div>
        <Typography
          onClick={handleSelectionClick}
          component="div"
          className={classes?.label}
          sx={{ marginLeft: 1 }}
        >
          {label}
        </Typography>
      </div>
    );
  }
);

/**
 * Custom TreeItem component with enhanced functionality
 */
export const CustomTreeItem = forwardRef<HTMLLIElement, CustomTreeItemProps>(
  function CustomTreeItem(props, ref) {
    const {
      nodeId,
      label,
      onSelect,
      onContextMenu,
      folder,
      children,
      ...otherProps
    } = props;

    // Handler for selecting a folder
    const handleSelect = ({
      nodeId,
      label,
    }: {
      nodeId: string;
      label: React.ReactNode;
    }) => {
      onSelect(folder);
    };

    return (
      <TreeItem
        nodeId={nodeId}
        label={label}
        ref={ref}
        ContentComponent={(contentProps) => (
          <CustomContent
            {...contentProps}
            onSelect={handleSelect}
            label={contentProps.label || label}
          />
        )}
        onContextMenu={(e) => onContextMenu(folder, e)}
        TransitionComponent={TransitionComponent}
        {...otherProps}
      >
        {children}
      </TreeItem>
    );
  }
);
