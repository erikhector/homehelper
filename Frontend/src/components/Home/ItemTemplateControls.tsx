import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tooltip } from "@mui/material";

import type { ItemTemplate } from "Src/api/Dto";

interface ItemTemplateControlsProps {
  currentUserId: number | undefined;
  isApplyingTemplate: boolean;
  isDeletingTemplate: boolean;
  itemTemplates: ItemTemplate[];
  onApplyTemplate: () => void;
  onCreateTemplate: () => void;
  onDeleteTemplate: () => void;
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId: string;
}

export default function ItemTemplateControls({
  currentUserId,
  isApplyingTemplate,
  isDeletingTemplate,
  itemTemplates,
  onApplyTemplate,
  onCreateTemplate,
  onDeleteTemplate,
  onSelectTemplate,
  selectedTemplateId
}: ItemTemplateControlsProps) {
  const selectedTemplate = itemTemplates.find((template) => template.itemTemplateId === Number(selectedTemplateId));
  const canDeleteSelectedTemplate = Boolean(selectedTemplate?.createdByUserId && selectedTemplate.createdByUserId === currentUserId);

  return (
    <Stack direction={{ sm: "row", xs: "column" }} spacing={1} sx={{ mb: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="template-select-label">Använd mall</InputLabel>
        <Select
          label="Använd mall"
          labelId="template-select-label"
          value={selectedTemplateId}
          onChange={(event) => onSelectTemplate(event.target.value)}
        >
          {itemTemplates.map((template) => (
            <MenuItem key={template.itemTemplateId} value={template.itemTemplateId}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button disabled={!selectedTemplateId || isApplyingTemplate} variant="outlined" onClick={onApplyTemplate}>
        {isApplyingTemplate ? <CircularProgress aria-label="Använder mall" size={20} /> : "Använd mall"}
      </Button>
      <Tooltip title={canDeleteSelectedTemplate ? "Ta bort mall" : "Du kan bara ta bort mallar som du har skapat"}>
        <span>
          <IconButton
            aria-label="Ta bort vald mall"
            color="error"
            disabled={!canDeleteSelectedTemplate || isDeletingTemplate}
            onClick={onDeleteTemplate}
          >
            {isDeletingTemplate ? <CircularProgress aria-label="Tar bort mall" size={20} /> : <DeleteRoundedIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <Button variant="outlined" onClick={onCreateTemplate}>
        Spara som mall
      </Button>
    </Stack>
  );
}
