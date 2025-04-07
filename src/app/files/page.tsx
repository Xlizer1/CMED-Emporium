import { FileManager } from "@/components/FileManager/FileManager";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
    return (
        <Box
            sx={{
                paddingTop: 8,
            }}
        >
            <FileManager />
        </Box>
    );
};

export default page;
