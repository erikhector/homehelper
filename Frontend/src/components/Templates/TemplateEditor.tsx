import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Box, Button, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import type { ItemTemplate, ItemTemplateEntryRequest } from "Src/api/Dto";

export interface TemplateFormValues {
  entries: ItemTemplateEntryRequest[];
  name: string;
}

interface TemplateEditorProps {
  isPending: boolean;
  onSubmit: (values: TemplateFormValues) => void;
  template: ItemTemplate | undefined;
}

const emptyEntry: ItemTemplateEntryRequest = { category: "", name: "", quantity: 1 };

export default function TemplateEditor({ isPending, onSubmit, template }: TemplateEditorProps) {
  const { control, handleSubmit, register, reset } = useForm<TemplateFormValues>({ defaultValues: { entries: [emptyEntry], name: "" } });
  const { append, fields, remove } = useFieldArray({ control, name: "entries" });

  useEffect(() => {
    reset({
      entries: template?.entries.map(({ category, name, quantity }) => ({ category, name, quantity })) ?? [emptyEntry],
      name: template?.name ?? ""
    });
  }, [reset, template]);

  return (
    <Paper component="section" variant="outlined">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: { sm: 3, xs: 2 } }}>
          <TextField autoFocus label="Mallens namn" required {...register("name", { required: true })} />
          <Typography component="h2" variant="h6">
            Saker som ska finnas på förskolan
          </Typography>
          {fields.map((field, index) => (
            <Stack key={field.id} direction={{ sm: "row", xs: "column" }} spacing={1} sx={{ alignItems: "flex-start" }}>
              <TextField fullWidth label="Sak" required {...register(`entries.${index}.name`, { required: true })} />
              <TextField fullWidth label="Kategori" required {...register(`entries.${index}.category`, { required: true })} />
              <TextField
                label="Antal"
                required
                slotProps={{ htmlInput: { min: 0 } }}
                sx={{ minWidth: { sm: 112 } }}
                type="number"
                {...register(`entries.${index}.quantity`, { min: 0, required: true, valueAsNumber: true })}
              />
              <Tooltip title="Ta bort rad">
                <span>
                  <IconButton aria-label="Ta bort rad" color="error" disabled={fields.length === 1} onClick={() => remove(index)}>
                    <DeleteRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          ))}
          <Box>
            <Button startIcon={<AddRoundedIcon />} onClick={() => append(emptyEntry)}>
              Lägg till sak
            </Button>
          </Box>
          <Box>
            <Button disabled={isPending} type="submit" variant="contained">
              {isPending ? "Sparar..." : template ? "Spara ändringar" : "Skapa mall"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
