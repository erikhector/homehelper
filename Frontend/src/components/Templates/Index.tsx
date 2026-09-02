import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

import type { TemplateFormValues } from "Src/components/Templates/TemplateEditor";

import { createItemTemplate, deleteItemTemplate, getChildren, getItemTemplates, updateItemTemplate } from "Src/api/Children";

import TemplateEditor from "Src/components/Templates/TemplateEditor";

export default function Index() {
  const queryClient = useQueryClient();
  const [selectedChildId, setSelectedChildId] = useState<number | "">("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "">("");
  const childrenQuery = useQuery({ queryFn: getChildren, queryKey: ["children"] });
  const activeChildId = selectedChildId || childrenQuery.data?.[0]?.childId || "";
  const templatesQuery = useQuery({
    enabled: activeChildId !== "",
    queryFn: () => getItemTemplates(activeChildId as number),
    queryKey: ["children", activeChildId, "item-templates"]
  });
  const templates = templatesQuery.data ?? [];
  const selectedTemplate = templates.find((template) => template.itemTemplateId === selectedTemplateId);
  const invalidateTemplates = async () => {
    await queryClient.invalidateQueries({ queryKey: ["children", activeChildId, "item-templates"] });
    await queryClient.invalidateQueries({ queryKey: ["children"] });
    await queryClient.invalidateQueries({ queryKey: ["children", activeChildId, "items"] });
  };
  const createTemplateMutation = useMutation({
    mutationFn: (values: TemplateFormValues) => createItemTemplate(activeChildId as number, values),
    onSuccess: async (template) => {
      setSelectedTemplateId(template.itemTemplateId);
      await invalidateTemplates();
    }
  });
  const updateTemplateMutation = useMutation({
    mutationFn: (values: TemplateFormValues) => updateItemTemplate(activeChildId as number, selectedTemplateId as number, values),
    onSuccess: invalidateTemplates
  });
  const deleteTemplateMutation = useMutation({
    mutationFn: (itemTemplateId: number) => deleteItemTemplate(activeChildId as number, itemTemplateId),
    onSuccess: async () => {
      setSelectedTemplateId("");
      await invalidateTemplates();
    }
  });
  const isSaving = createTemplateMutation.isPending || updateTemplateMutation.isPending;
  const error = templatesQuery.isError || createTemplateMutation.isError || updateTemplateMutation.isError || deleteTemplateMutation.isError;

  const saveTemplate = (values: TemplateFormValues) => {
    const request = {
      entries: values.entries.map((entry) => ({ ...entry, category: entry.category.trim(), name: entry.name.trim() })),
      name: values.name.trim()
    };
    if (selectedTemplate) updateTemplateMutation.mutate(request);
    else createTemplateMutation.mutate(request);
  };

  return (
    <>
      <Helmet title="Mallar" />
      <Box component="section" sx={{ margin: "0 auto", maxWidth: 960, px: { sm: 4, xs: 2 }, py: { sm: 5, xs: 3 } }}>
        <Stack direction={{ sm: "row", xs: "column" }} spacing={2} sx={{ justifyContent: "space-between", mb: 3 }}>
          <Box>
            <Typography component="h1" variant="h4">
              Mallar
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Bestäm vad som ska finnas på förskolan för varje barn.
            </Typography>
          </Box>
          <Stack direction={{ sm: "row", xs: "column" }} spacing={1}>
            <Button component={Link} startIcon={<ArrowBackRoundedIcon />} to="/children" variant="outlined">
              Gå tillbaka
            </Button>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="template-child-label">Barn</InputLabel>
              <Select
                label="Barn"
                labelId="template-child-label"
                value={activeChildId}
                onChange={(event) => {
                  setSelectedChildId(Number(event.target.value));
                  setSelectedTemplateId("");
                }}
              >
                {childrenQuery.data?.map((child) => (
                  <MenuItem key={child.childId} value={child.childId}>
                    {[child.firstName, child.lastName].filter(Boolean).join(" ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Paper component="aside" sx={{ mb: 3, p: 2 }} variant="outlined">
          <Stack direction="row" spacing={1.5}>
            <HelpOutlineRoundedIcon color="primary" sx={{ mt: 0.25 }} />
            <Box>
              <Typography component="h2" variant="subtitle1">
                Så fungerar HomeHelper
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Välj ett barn, skapa en mall med saker och önskat antal och aktivera sedan mallen på barnets startsida. Där ser du vad som saknas på
                förskolan och kan uppdatera antalet som finns kvar.
              </Typography>
            </Box>
          </Stack>
        </Paper>
        {childrenQuery.isLoading && <CircularProgress aria-label="Laddar barn" />}
        {!childrenQuery.isLoading && activeChildId === "" && (
          <Paper sx={{ p: 3 }} variant="outlined">
            <Typography>Du behöver lägga till ett barn innan du kan skapa en mall.</Typography>
          </Paper>
        )}
        {activeChildId !== "" && (
          <Stack spacing={2}>
            <Stack direction={{ sm: "row", xs: "column" }} spacing={1} sx={{ alignItems: { sm: "center" } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="template-select-label">Redigera mall</InputLabel>
                <Select
                  label="Redigera mall"
                  labelId="template-select-label"
                  value={selectedTemplateId}
                  onChange={(event) => setSelectedTemplateId(Number(event.target.value))}
                >
                  <MenuItem value="">Ny mall</MenuItem>
                  {templates.map((template) => (
                    <MenuItem key={template.itemTemplateId} value={template.itemTemplateId}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button startIcon={<AddRoundedIcon />} onClick={() => setSelectedTemplateId("")}>
                Ny mall
              </Button>
              <Tooltip title="Ta bort mall">
                <span>
                  <IconButton
                    aria-label="Ta bort mall"
                    color="error"
                    disabled={!selectedTemplate || deleteTemplateMutation.isPending}
                    onClick={() => selectedTemplate && deleteTemplateMutation.mutate(selectedTemplate.itemTemplateId)}
                  >
                    {deleteTemplateMutation.isPending ? <CircularProgress size={20} /> : <DeleteRoundedIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
            {error && <Alert severity="error">Det gick inte att spara mallen. Försök igen.</Alert>}
            <TemplateEditor isPending={isSaving} template={selectedTemplate} onSubmit={saveTemplate} />
          </Stack>
        )}
      </Box>
    </>
  );
}
