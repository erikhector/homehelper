import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";

import type { Child, Item, ItemTemplate } from "Src/api/Dto";

import ItemTemplateControls from "Src/components/Home/ItemTemplateControls";
import PackingList from "Src/components/Home/PackingList";
import TomorrowSummary from "Src/components/Home/TomorrowSummary";

interface HomeDashboardContentProps {
  childProfiles: Child[];
  isActivatingTemplate: boolean;
  isDeletingItemId: number | undefined;
  isLoadingChildren: boolean;
  isUpdatingItemId: number | undefined;
  items: Item[];
  itemTemplates: ItemTemplate[];
  onAddChild: () => void;
  onAddItem: () => void;
  onActivateTemplate: (templateId: number) => void;
  onDeleteItem: (item: Item) => void;
  onUpdateItemQuantities: (item: Item, quantities: Pick<Item, "homeQuantity" | "kindergartenQuantity">) => void;
  selectedChild: Child | undefined;
}

export default function HomeDashboardContent({
  childProfiles,
  isActivatingTemplate,
  isDeletingItemId,
  isLoadingChildren,
  isUpdatingItemId,
  items,
  itemTemplates,
  onAddChild,
  onAddItem,
  onActivateTemplate,
  onDeleteItem,
  onUpdateItemQuantities,
  selectedChild
}: HomeDashboardContentProps) {
  const kindergartenCount = items.reduce((total, item) => total + item.kindergartenQuantity, 0);
  const missingItems = items.filter((item) => (item.itemTemplateEntry?.quantity ?? 0) > item.kindergartenQuantity);

  if (isLoadingChildren) {
    return (
      <Box sx={{ display: "grid", minHeight: 240, placeItems: "center" }}>
        <CircularProgress aria-label="Laddar barn" />
      </Box>
    );
  }

  if (childProfiles.length === 0) {
    return (
      <Paper sx={{ mt: 2, p: { sm: 4, xs: 3 }, textAlign: "center" }} variant="outlined">
        <Typography component="h2" variant="h6">
          Lägg till ditt första barn
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Börja med att lägga till ett barn för att hålla koll på sakerna på förskolan.
        </Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={onAddChild}>
          Lägg till barn
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <ItemTemplateControls
        activeItemTemplateId={selectedChild?.activeItemTemplateId}
        isActivatingTemplate={isActivatingTemplate}
        itemTemplates={itemTemplates}
        onActivateTemplate={onActivateTemplate}
      />
      <TomorrowSummary atKindergartenCount={kindergartenCount} missingItems={missingItems} />
      <PackingList
        isDeletingItemId={isDeletingItemId}
        isUpdatingItemId={isUpdatingItemId}
        items={items}
        selectedChild={selectedChild}
        onAddItem={onAddItem}
        onDeleteItem={onDeleteItem}
        onUpdateItemQuantities={onUpdateItemQuantities}
      />
    </>
  );
}
