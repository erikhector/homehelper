import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { Link } from "react-router";

import type { ItemTemplate } from "Src/api/Dto";

interface ItemTemplateControlsProps {
  activeItemTemplateId: number | null | undefined;
  isActivatingTemplate: boolean;
  itemTemplates: ItemTemplate[];
  onActivateTemplate: (templateId: number) => void;
}

export default function ItemTemplateControls({
  activeItemTemplateId,
  isActivatingTemplate,
  itemTemplates,
  onActivateTemplate
}: ItemTemplateControlsProps) {
  return (
    <Stack direction={{ sm: "row", xs: "column" }} spacing={1} sx={{ mb: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="template-select-label">Aktiv mall</InputLabel>
        <Select
          label="Aktiv mall"
          labelId="template-select-label"
          value={activeItemTemplateId ?? ""}
          onChange={(event) => onActivateTemplate(Number(event.target.value))}
        >
          <MenuItem disabled value="">
            Välj mall
          </MenuItem>
          {itemTemplates.map((template) => (
            <MenuItem key={template.itemTemplateId} value={template.itemTemplateId}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isActivatingTemplate && <CircularProgress aria-label="Byter aktiv mall" size={24} />}
      <Button component={Link} startIcon={<SettingsRoundedIcon />} to="/templates" variant="outlined">
        Hantera mallar
      </Button>
    </Stack>
  );
}
