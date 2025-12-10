import React from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Divider,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import { Delete as DeleteIcon, Close as CloseIcon } from "@mui/icons-material";

import { useElementEditor } from "../../hooks/useElementEditor";
import ValidationEditor from "./ValidationEditor";
import OptionsEditor from "./OptionsEditor";
import ConditionalLogicEditor from "./ConditionalLogicEditor";

const ElementEditor = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onClose,
  compact = false,
  formElements = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); 
  const isGroup = selectedElement?.type === "group";
  const editor = useElementEditor(selectedElement, onUpdateElement, formElements);

  const renderContent = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant={compact ? "h6" : "h5"} fontWeight="bold">
            {isGroup ? "Group Settings" : "Field Settings"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {selectedElement.id}
          </Typography>
        </Box>
         {(isMobile || compact) && (
  <IconButton onClick={onClose}>
    <CloseIcon />
  </IconButton>
)}

      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {isGroup && (
          <TextField
            label="Group Name"
            value={selectedElement.name || ""}
            onChange={(e) => editor.update({ name: e.target.value })}
            fullWidth
          />
        )}

        {!isGroup && (
          <TextField
            label="Field Label"
            value={selectedElement.label || ""}
            onChange={(e) => editor.update({ label: e.target.value })}
            fullWidth
          />
        )}
        {!isGroup && (
          <ValidationEditor selectedElement={selectedElement} updateValidation={editor.updateValidation} />
        )}

        {(!isGroup && ["Radio Group", "DropDown"].includes(selectedElement.type)) && (
          <OptionsEditor selectedElement={selectedElement} update={editor.update} />
        )}

        <ConditionalLogicEditor
          selectedElement={selectedElement}
          availableFields={editor.availableFields}
          {...editor}
        />

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDeleteElement(selectedElement.id)}
          fullWidth
          sx={{ mt: 2 }}
        >
          Delete {isGroup ? "Group" : "Field"}
        </Button>
      </Stack>
    </>
  );

  if (!selectedElement) {
    if (isMobile) {
      return null; 
    }
    return (
      <Box p={4} textAlign="center" color="text.secondary">
        <Typography variant="h6">No element selected</Typography>
        <Typography variant="body2">Double-click any field or group on the canvas to edit</Typography>
      </Box>
    );
  }

  if (!isMobile || compact) {
    return (
      <Box p={compact ? 2 : 4} height="100%" overflow="auto" bgcolor="background.paper">
        {renderContent()}
      </Box>
    );
  }

  return (
    <Drawer
      anchor="bottom"
      open={!!selectedElement}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, 
      }}
      PaperProps={{
        sx: {
          height: "100%",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 0,
        },
      }}
    >
      <Box height="100%" display="flex" flexDirection="column" overflow="auto">
        {renderContent()}
      </Box>
    </Drawer>
  );
};

export default ElementEditor;
