import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";

import type { Child, Item, ItemTemplate } from "Src/api/Dto";

import ItemTemplateControls from "Src/components/Home/ItemTemplateControls";
import PackingList from "Src/components/Home/PackingList";
import TomorrowSummary from "Src/components/Home/TomorrowSummary";

interface HomeDashboardContentProps {
  childProfiles: Child[];
  currentUserId: number | undefined;
  isApplyingTemplate: boolean;
  isDeletingItemId: number | undefined;
  isDeletingTemplate: boolean;
  isLoadingChildren: boolean;
  isUpdatingItemId: number | undefined;
  items: Item[];
  itemTemplates: ItemTemplate[];
  onAddChild: () => void;
  onAddItem: () => void;
  onApplyTemplate: () => void;
  onCreateTemplate: () => void;
  onDeleteItem: (item: Item) => void;
  onDeleteTemplate: () => void;
  onSelectTemplate: (templateId: string) => void;
  onUpdateItemQuantities: (item: Item, quantities: Pick<Item, "homeQuantity" | "kindergartenQuantity">) => void;
  selectedChild: Child | undefined;
  selectedTemplateId: string;
}

export default function HomeDashboardContent({
  childProfiles,
  currentUserId,
  isApplyingTemplate,
  isDeletingItemId,
  isDeletingTemplate,
  isLoadingChildren,
  isUpdatingItemId,
  items,
  itemTemplates,
  onAddChild,
  onAddItem,
  onApplyTemplate,
  onCreateTemplate,
  onDeleteItem,
  onDeleteTemplate,
  onSelectTemplate,
  onUpdateItemQuantities,
  selectedChild,
  selectedTemplateId
}: HomeDashboardContentProps) {
  const homeCount = items.reduce((total, item) => total + item.homeQuantity, 0);
  const kindergartenCount = items.reduce((total, item) => total + item.kindergartenQuantity, 0);

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
        currentUserId={currentUserId}
        isApplyingTemplate={isApplyingTemplate}
        isDeletingTemplate={isDeletingTemplate}
        itemTemplates={itemTemplates}
        selectedTemplateId={selectedTemplateId}
        onApplyTemplate={onApplyTemplate}
        onCreateTemplate={onCreateTemplate}
        onDeleteTemplate={onDeleteTemplate}
        onSelectTemplate={onSelectTemplate}
      />
      <TomorrowSummary atKindergartenCount={kindergartenCount} homeCount={homeCount} />
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
