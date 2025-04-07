export interface FileSearchOption {
  id: number;
  name: string;
  type: string;
  file_name?: string;
}

export interface Folder {
  id: number;
  name: string;
  level?: number;
  sub_classifications?: Folder[];
  file_name?: string;
  nodeId?: string;
  parentFolder?: boolean;
  treeFolder?: boolean;
  path?: string;
}

export interface MenuPosition {
  x: number;
  y: number;
  from_side_menu: boolean;
}

export interface FileOperations {
  downloadFile: (item: Folder) => Promise<void>;
  deleteFileOrFolder: (item: Folder) => Promise<void>;
  updateFile: (item: Folder) => void;
  createFolder: () => void;
  addFile: () => void;
  specifyFolderAccess: () => void;
}
