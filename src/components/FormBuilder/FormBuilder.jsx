import React from "react";
import { Box, Fab, Drawer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ElementsSider from "../Sider/ElementsSider";
import FormCanvas from './FormCanvas'
import ElementEditor from "../ElementsEditor/ElementEditor";
import { useFormStore } from "../../store/formStore";
import Alert from '@mui/material/Alert';

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createElement = (id, type) => {
  const base = { id, type, conditional: [] };

  const commonTextValidation = {
    required: false,
    minLength: null,
    maxLength: null,
    pattern: "",
    customMessage: "",
  };

  switch (type) {
    case "Short Text":
      return {
        ...base,
        label: "Short Text Field",
        placeholder: "Enter text...",
        defaultValue: "",
        helperText: "",
        readOnly: false,
        disabled: false,
        validation: { ...commonTextValidation },
      };
    case "Email":
      return {
        ...base,
        label: "Email Address",
        placeholder: "name@example.com",
        defaultValue: "",
        helperText: "We'll never share your email.",
        readOnly: false,
        disabled: false,
        validation: { ...commonTextValidation, pattern: "\\S+@\\S+\\.\\S+" },
      };
    case "Number":
      return {
        ...base,
        label: "Number Input",
        placeholder: "0",
        defaultValue: "",
        helperText: "",
        readOnly: false,
        disabled: false,
        validation: {
          required: false,
          min: null,
          max: null,
          customMessage: "",
        },
      };
    case "Radio Group":
      return {
        ...base,
        label: "Choose one option",
        required: false,
        direction: "vertical",
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
        defaultValue: "",
        helperText: "",
        validation: { required: false, customMessage: "" },
      };
    case "Checkbox":
      return {
        ...base,
        label: "I agree to the terms",
        defaultChecked: false,
        helperText: "",
        disabled: false,
        validation: { required: false, customMessage: "" },  
      };
    case "Date":
      return {
        ...base,
        label: "Select Date",
        defaultDate: "",
        helperText: "",
        format: "YYYY-MM-DD",
        disabled: false,
        validation: { required: false, minDate: null, maxDate: null, customMessage: "" },
      };
    case "DropDown":
      return {
        ...base,
        label: "Select an option",
        placeholder: "Choose...",
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
        defaultValue: "",
        helperText: "",
        validation: { required: false, customMessage: "" },
      };
    case "Text Area":
      return {
        ...base,
        label: "Long Text",
        placeholder: "Enter your message...",
        defaultValue: "",
        rows: 4,
        helperText: "",
        disabled: false,
        validation: { ...commonTextValidation },
      };
    default:
      return { ...base, label: `${type} Field`, validation: { required: false, customMessage: "" } };
  }
};

function FormBuilder() {
  const {
    formElements,
    nextId,
    selectedElementId,
    addElement,
    updateElement,
    deleteElement,
    reorderElements,
    setSelectedElementId,
    clearSelection,
  } = useFormStore();

  const [tabValue, setTabValue] = React.useState(0);
  const [groupName, setGroupName] = React.useState("");
  const [groupFields, setGroupFields] = React.useState([]);
  const [groupedElements, setGroupedElements] = React.useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const selectedElement =
    formElements.flatMap((el) => (el.type === "group" ? [el, ...el.fields] : [el])).find((el) => el.id === selectedElementId) || null;

  const addBasicElement = (type) => {
    const element = createElement(nextId, type);
    addElement(element);
    setDrawerOpen(false);
  };

  const saveGroup = () => {
    if (!groupName.trim() && groupFields.length != 0){
       <Alert  severity="danger">
      Please Enter a group Name.
    </Alert>
      return;
    } 
       if ( groupFields.length === 0){
      return;
    } 

    const groupTemplate = {
      name: groupName.trim(),
      fields: groupFields.map((f) => ({
        id: f.id,
        type: f.type,
        label: f.label,
      })),
    };

    setGroupedElements((prev) => [
      ...prev,
      { ...groupTemplate, templateId: generateUniqueId() },
    ]);

    const newFields = groupFields.map((f) => ({
      id: generateUniqueId(),
      type: f.type,
      label: f.label || `${f.type} Field`,
      placeholder: f.placeholder || `Enter ${f.type.toLowerCase()}`,
      defaultValue: f.defaultValue || "",
      helperText: f.helperText || "",
      validation: f.validation || { required: false, customMessage: "" },
      conditional: [],
    }));

    addElement({
      type: "group",
      name: groupName.trim(),
      fields: newFields,
      conditional: [],
    });

    setGroupName("");
    setGroupFields([]);
    setTabValue(0);
  };

  const addGroupToCanvas = (groupTemplate) => {
    const newFields = groupTemplate.fields.map((f) => ({
      id: generateUniqueId(),
      type: f.type,
      label: f.label,
      required: false,
      conditional: [],
      placeholder: `Enter ${f.type.toLowerCase()}`,
      defaultValue: "",
      helperText: "",
      validation: { required: false, customMessage: "" },
    }));

    addElement({
      type: "group",
      name: groupTemplate.name,
      fields: newFields,
      conditional: [],
    });
  };

  const addFieldToGroup = (type) => {
    const newField = {
      id: generateUniqueId(),
      type,
      label: `${type} Field`,
      placeholder: `Enter ${type.toLowerCase()}`,
      defaultValue: "",
      helperText: "",
      validation: { required: false, customMessage: "" },
    };
    setGroupFields((prev) => [...prev, newField]);
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f9fafb" position="relative">
      <Box className="hidden md:block flex-shrink-0 w-80 border-r bg-white" sx={{ height: "100vh", overflowY: "auto" }}>
        <ElementsSider
          tabValue={tabValue}
          onTabChange={(_, v) => setTabValue(v)}
          groupName={groupName}
          setGroupName={setGroupName}
          groupFields={groupFields}
          onAddBasic={addBasicElement}
          onAddToGroup={addFieldToGroup}
          onRemoveFromGroup={(i) => setGroupFields((prev) => prev.filter((_, idx) => idx !== i))}
          onSaveGroup={saveGroup}
          groupedElements={groupedElements}
          onAddGroupToCanvas={addGroupToCanvas}
        />
      </Box>

      <Fab color="primary" onClick={() => setDrawerOpen(true)} sx={{ position: "fixed", top: 20, left: 16, zIndex: 1300, display: { xs: "flex", md: "none" }, bgcolor: "purple.600" }}>
        <AddIcon />
      </Fab>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: "85%", maxWidth: 340, height: "100%" } }}>
        <ElementsSider
          tabValue={tabValue}
          onTabChange={(_, v) => setTabValue(v)}
          groupName={groupName}
          setGroupName={setGroupName}
          groupFields={groupFields}
          onAddBasic={addBasicElement}
          onAddToGroup={addFieldToGroup}
          onRemoveFromGroup={(i) => setGroupFields((prev) => prev.filter((_, idx) => idx !== i))}
          onSaveGroup={saveGroup}
          groupedElements={groupedElements}
          onAddGroupToCanvas={addGroupToCanvas}
        />
      </Drawer>

      <Box flexGrow={1} p={{ xs: 2, md: 6 }} onClick={clearSelection} sx={{ height: "100vh", overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        <FormCanvas formElements={formElements} selectedElementId={selectedElementId} onElementClick={setSelectedElementId} onReorder={reorderElements} />
      </Box>

      <Box className="hidden lg:block flex-shrink-0 w-96 border-l bg-white shadow-2xl" sx={{ height: "100vh", overflowY: "auto" }}>
        <ElementEditor selectedElement={selectedElement} formElements={formElements} onUpdateElement={updateElement} onDeleteElement={deleteElement} />
      </Box>

      {selectedElement && (
        <Box className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t-2 shadow-2xl z-50">
          <ElementEditor selectedElement={selectedElement} formElements={formElements} compact onUpdateElement={updateElement} onClose={clearSelection} onDeleteElement={deleteElement} />
        </Box>
      )}
    </Box>
  );
}

export default FormBuilder;
