import React from "react";
import {
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import LayersIcon from "@mui/icons-material/Layers";

import BasicFieldsList from "./BasicFieldsList";
import GroupBuilder from "./GroupBuilder";
import SavedGroupsList from "./SavedGroupsList";
import SaveGroupButton from "./SaveGroupButton";

const basicTypes = [
  "Short Text",
  "Email",
  "Number",
  "Radio Group",
  "Checkbox",
  "Date",
  "DropDown",
  "Text Area",
];

const ElementsSider = ({
  tabValue,
  onTabChange,
  groupName,
  setGroupName,
  groupFields,
  onAddBasic,
  onAddToGroup,
  onSaveGroup,
  groupedElements,
  onAddGroupToCanvas,
  drawerOpen = true,
}) => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down("sm")); 
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md")); 
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg")); 

  let siderWidth = 320; // default
  if (isXs) siderWidth = "100%";
  else if (isMd) siderWidth = 280;
  else if (isLgUp) siderWidth = 340;

  return (
    <Box
      sx={{
        width: siderWidth,
        minWidth: 200,
        maxWidth: "100%",
        height: "100vh",
        bgcolor: theme.palette.background.paper,
        borderRight: 1,
        borderColor: theme.palette.divider,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        transition: "width 0.3s ease",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        variant="fullWidth"
        sx={{
          bgcolor: "background.default",
          borderBottom: `1px solid ${theme.palette.divider}`,
          "& .MuiTab-root": {
            fontWeight: 600,
            textTransform: "none",
            color: theme.palette.text.primary,
          },
          "& .Mui-selected": {
            color: theme.palette.primary.main,
          },
          minHeight:68
        }}
      >
        <Tab icon={<LayersIcon />} label="Elements" />
        <Tab icon={<WidgetsIcon />} label="Widgets" />
      </Tabs>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {tabValue === 0 && (
          <BasicFieldsList basicTypes={basicTypes} onAddBasic={onAddBasic} />
        )}

        {tabValue === 1 && (
          <>
            <GroupBuilder
              groupName={groupName}
              setGroupName={setGroupName}
              basicTypes={basicTypes}
              onAddToGroup={onAddToGroup}
              groupFields={groupFields}
              onSaveGroup={onSaveGroup}
            />

            <SavedGroupsList
              groupedElements={groupedElements}
              onAddGroupToCanvas={onAddGroupToCanvas}
            />
          </>
        )}
      </Box>

      {!drawerOpen && groupFields.length > 0 && (
        <SaveGroupButton onSaveGroup={onSaveGroup} />
      )}
    </Box>
  );
};

export default ElementsSider;
