import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  Avatar,
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
  TextField,
  Tooltip,
  Typography
} from "@mui/material";

import type { Child, Item } from "Src/api/Dto";

interface PackingListProps {
  isDeletingItemId: number | undefined;
  isUpdatingItemId: number | undefined;
  items: Item[];
  onAddItem: () => void;
  onDeleteItem: (item: Item) => void;
  onUpdateItemQuantities: (item: Item, quantities: Pick<Item, "homeQuantity" | "kindergartenQuantity">) => void;
  selectedChild: Child | undefined;
}

export default function PackingList({
  isDeletingItemId,
  isUpdatingItemId,
  items,
  onAddItem,
  onDeleteItem,
  onUpdateItemQuantities,
  selectedChild
}: PackingListProps) {
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
      <Paper component="section" variant="outlined">
        <Stack direction={{ sm: "row", xs: "column" }} spacing={1} sx={{ p: 1.5 }}>
          <TextField label="Sok pa namn" size="small" value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-order-label">Sortera</InputLabel>
            <Select label="Sortera" labelId="sort-order-label" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <MenuItem value="name">Namn</MenuItem>
              <MenuItem value="category">Kategori</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {visibleItems.length === 0 && (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            Inga saker matchar ditt urval.
          </Typography>
        )}
        {visibleItems.map((item) => {
          const isDeletingItem = item.itemId === isDeletingItemId;
          const isUpdatingItem = item.itemId === isUpdatingItemId;
          const isOperatingOnItem = isDeletingItem || isUpdatingItem;
          const updateKindergartenQuantity = (kindergartenQuantity: number) =>
            onUpdateItemQuantities(item, { homeQuantity: item.homeQuantity, kindergartenQuantity });
          const updateHomeQuantity = (homeQuantity: number) =>
            onUpdateItemQuantities(item, { homeQuantity, kindergartenQuantity: item.kindergartenQuantity });

          return (
            <Box key={item.itemId}>
              <Box
                sx={{
                  alignItems: { sm: "center" },
                  display: "flex",
                  flexDirection: { sm: "row", xs: "column" },
                  gap: 1,
                  px: { sm: 2, xs: 1.5 },
                  py: 1
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: item.homeQuantity > 0 ? "#fff1d9" : "primary.light",
                    color: item.homeQuantity > 0 ? "warning.main" : "primary.dark"
                  }}
                >
                  <CheckCircleRoundedIcon />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {item.category}
                  </Typography>
                </Box>
                <Stack direction={{ sm: "row", xs: "column" }} spacing={1.5} sx={{ alignItems: { sm: "center" }, width: { sm: "auto", xs: "100%" } }}>
                  <Box
                    sx={{ alignItems: "center", border: 1, borderColor: "divider", borderRadius: 1, display: "flex", gap: 0.5, px: 0.5, py: 0.25 }}
                  >
                    <Typography color="text.secondary" sx={{ minWidth: 74 }} variant="body2">
                      Förskolan
                    </Typography>
                    <IconButton
                      aria-label={`Minska ${item.name} på förskolan`}
                      disabled={isOperatingOnItem || item.kindergartenQuantity === 0}
                      size="small"
                      onClick={() => updateKindergartenQuantity(item.kindergartenQuantity - 1)}
                    >
                      <RemoveRoundedIcon fontSize="small" />
                    </IconButton>
                    <Typography aria-label={`${item.kindergartenQuantity} på förskolan`} sx={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                      {item.kindergartenQuantity}
                    </Typography>
                    <IconButton
                      aria-label={`Öka ${item.name} på förskolan`}
                      disabled={isOperatingOnItem}
                      size="small"
                      onClick={() => updateKindergartenQuantity(item.kindergartenQuantity + 1)}
                    >
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{ alignItems: "center", border: 1, borderColor: "divider", borderRadius: 1, display: "flex", gap: 0.5, px: 0.5, py: 0.25 }}
                  >
                    <Typography color="text.secondary" sx={{ minWidth: 74 }} variant="body2">
                      Hemma
                    </Typography>
                    <IconButton
                      aria-label={`Minska ${item.name} hemma`}
                      disabled={isOperatingOnItem || item.homeQuantity === 0}
                      size="small"
                      onClick={() => updateHomeQuantity(item.homeQuantity - 1)}
                    >
                      <RemoveRoundedIcon fontSize="small" />
                    </IconButton>
                    <Typography aria-label={`${item.homeQuantity} hemma`} sx={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                      {item.homeQuantity}
                    </Typography>
                    <IconButton
                      aria-label={`Öka ${item.name} hemma`}
                      disabled={isOperatingOnItem}
                      size="small"
                      onClick={() => updateHomeQuantity(item.homeQuantity + 1)}
                    >
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>
                <Box sx={{ alignItems: "center", display: "flex", minHeight: 40 }}>
                  {isUpdatingItem && <CircularProgress aria-label="Sparar antal" size={22} />}
                  {!isUpdatingItem && (
                    <Tooltip title="Ta bort sak">
                      <IconButton aria-label={`Ta bort ${item.name}`} color="error" disabled={isDeletingItem} onClick={() => onDeleteItem(item)}>
                        {isDeletingItem ? <CircularProgress aria-label="Tar bort sak" size={22} /> : <DeleteRoundedIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Paper>
    </>
  );
}
