import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import type { Child, Item } from "Src/api/Dto";

interface PackingListProps {
  isDeletingItemId: number | undefined;
  isFillingItems: boolean;
  isUpdatingItemId: number | undefined;
  items: Item[];
  onAddItem: () => void;
  onDeleteItem: (item: Item) => void;
  onUpdateItemQuantities: (item: Item, quantities: Pick<Item, "homeQuantity" | "kindergartenQuantity">) => void;
  selectedChild: Child | undefined;
}

const inventoryStatuses = {
  low: { color: "warning", icon: WarningAmberRoundedIcon, label: "Behöver fyllas på" },
  missing: { color: "error", icon: ErrorRoundedIcon, label: "Saknas - ta med till förskolan" },
  sufficient: { color: "success", icon: CheckCircleRoundedIcon, label: "Tillräckligt på förskolan" }
} as const;

export default function PackingList({
  isDeletingItemId,
  isFillingItems,
  isUpdatingItemId,
  items,
  onAddItem,
  onDeleteItem,
  onUpdateItemQuantities,
  selectedChild
}: PackingListProps) {
  const theme = useTheme();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"category" | "name">("name");
  const categories = [...new Set(items.map((item) => item.category))].toSorted((left, right) => left.localeCompare(right, "sv"));
  const visibleItems = items
    .filter((item) => !categoryFilter || item.category === categoryFilter)
    .filter((item) => item.name.toLocaleLowerCase("sv").includes(nameFilter.toLocaleLowerCase("sv")))
    .toSorted((left, right) =>
      (sortOrder === "name" ? left.name : left.category).localeCompare(sortOrder === "name" ? right.name : right.category, "sv")
    );

  return (
    <>
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography component="h2" variant="h6">
          Packlista
        </Typography>
        <Button disabled={!selectedChild} startIcon={<AddRoundedIcon />} variant="contained" onClick={onAddItem}>
          Lägg till sak
        </Button>
      </Box>
      <Paper component="section" sx={{ mb: 1.5, p: 1.25 }} variant="outlined">
        <Stack direction={{ sm: "row", xs: "column" }} spacing={1}>
          <TextField label="Sok pa namn" value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Kategori</InputLabel>
            <Select
              label="Kategori"
              labelId="category-filter-label"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <MenuItem value="">Alla kategorier</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="sort-order-label">Sortera</InputLabel>
            <Select label="Sortera" labelId="sort-order-label" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <MenuItem value="name">Namn</MenuItem>
              <MenuItem value="category">Kategori</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>
      {visibleItems.length === 0 && (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Inga saker matchar ditt urval.
        </Typography>
      )}
      <Stack spacing={0.75}>
        {visibleItems.map((item) => {
          const isDeletingItem = item.itemId === isDeletingItemId;
          const isUpdatingItem = item.itemId === isUpdatingItemId;
          const isOperatingOnItem = isDeletingItem || isUpdatingItem || isFillingItems;
          const targetQuantity = item.itemTemplateEntry?.quantity ?? 0;
          const missingQuantity = targetQuantity - item.kindergartenQuantity;
          let stockStatusKey: keyof typeof inventoryStatuses = "sufficient";
          if (missingQuantity > 1) stockStatusKey = "missing";
          if (missingQuantity === 1) stockStatusKey = "low";
          const stockStatus = inventoryStatuses[stockStatusKey];
          const StockStatusIcon = stockStatus.icon;
          const updateKindergartenQuantity = (kindergartenQuantity: number) =>
            onUpdateItemQuantities(item, { homeQuantity: item.homeQuantity, kindergartenQuantity });

          return (
            <Box
              key={item.itemId}
              sx={{
                alignItems: { sm: "center" },
                bgcolor: alpha(theme.palette[stockStatus.color].main, 0.08),
                border: 1,
                borderColor: alpha(theme.palette[stockStatus.color].main, 0.35),
                borderRadius: 1,
                display: "flex",
                flexDirection: { sm: "row", xs: "column" },
                gap: 1,
                px: 1.5,
                py: 0.75
              }}
            >
              <StockStatusIcon fontSize="small" sx={{ color: `${stockStatus.color}.main`, flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }} variant="body2">
                  {item.name}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {item.category} - {stockStatus.label}
                </Typography>
                {item.reorderUrl && (
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      clickable
                      component="a"
                      href={item.reorderUrl}
                      icon={<ShoppingCartRoundedIcon />}
                      label="Köp fler · Annons"
                      rel="noopener noreferrer sponsored"
                      target="_blank"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
              <Stack direction={{ sm: "row", xs: "column" }} spacing={1} sx={{ alignItems: { sm: "center" }, width: { sm: "auto", xs: "100%" } }}>
                <Box sx={{ alignItems: "center", border: 1, borderColor: "divider", borderRadius: 1, display: "flex", gap: 0.25, px: 0.5 }}>
                  <Typography color="text.secondary" sx={{ minWidth: 66 }} variant="caption">
                    Förskolan {item.kindergartenQuantity}/{targetQuantity}
                  </Typography>
                  <IconButton
                    aria-label={`Minska ${item.name} på förskolan`}
                    disabled={isOperatingOnItem || item.kindergartenQuantity === 0}
                    onClick={() => updateKindergartenQuantity(item.kindergartenQuantity - 1)}
                  >
                    <RemoveRoundedIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    aria-label={`${item.kindergartenQuantity} på förskolan`}
                    sx={{ fontWeight: 700, minWidth: 18, textAlign: "center" }}
                    variant="body2"
                  >
                    {item.kindergartenQuantity}
                  </Typography>
                  <IconButton
                    aria-label={`Öka ${item.name} på förskolan`}
                    disabled={isOperatingOnItem}
                    onClick={() => updateKindergartenQuantity(item.kindergartenQuantity + 1)}
                  >
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
                {missingQuantity > 0 && (
                  <Tooltip title={`Fyll på till ${targetQuantity} st på förskolan`}>
                    <span>
                      <IconButton
                        aria-label={`Fyll på ${item.name} till ${targetQuantity} på förskolan`}
                        color={stockStatus.color}
                        disabled={isOperatingOnItem}
                        onClick={() => updateKindergartenQuantity(targetQuantity)}
                      >
                        <PlaylistAddCheckRoundedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Stack>
              <Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", minHeight: 28, minWidth: 28 }}>
                {isUpdatingItem && <CircularProgress aria-label="Sparar antal" size={16} />}
                {!isUpdatingItem && (
                  <Tooltip title="Ta bort sak">
                    <IconButton aria-label={`Ta bort ${item.name}`} color="error" disabled={isDeletingItem} onClick={() => onDeleteItem(item)}>
                      {isDeletingItem ? <CircularProgress aria-label="Tar bort sak" size={16} /> : <DeleteRoundedIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </>
  );
}
