import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Item } from "Src/api/Dto";
import type { AddChildFormValues } from "Src/components/Home/AddChildDialog";
import type { AddItemFormValues } from "Src/components/Home/AddItemDialog";
import type { CreateItemTemplateFormValues } from "Src/components/Home/CreateItemTemplateDialog";
import type { ShareChildFormValues } from "Src/components/Home/ShareChildDialog";

import { getCurrentUser } from "Src/api/Auth";
import {
  applyItemTemplate,
  createChild,
  createItem,
  createItemTemplate,
  deleteChild,
  deleteItem,
  deleteItemTemplate,
  getChildren,
  getItems,
  getItemTemplates,
  revokeChildAccess,
  shareChild,
  updateItemQuantities
} from "Src/api/Children";
import { ProblemDetailsError } from "Src/api/HttpClient";

import AddChildDialog from "Src/components/Home/AddChildDialog";
import AddItemDialog from "Src/components/Home/AddItemDialog";
import ChildDashboardHeader from "Src/components/Home/ChildDashboardHeader";
import CreateItemTemplateDialog from "Src/components/Home/CreateItemTemplateDialog";
import ItemTemplateControls from "Src/components/Home/ItemTemplateControls";
import ManageChildAccessDialog from "Src/components/Home/ManageChildAccessDialog";
import PackingList from "Src/components/Home/PackingList";
import ShareChildDialog from "Src/components/Home/ShareChildDialog";
import TomorrowSummary from "Src/components/Home/TomorrowSummary";

export default function Index() {
  const queryClient = useQueryClient();
  const [selectedChildId, setSelectedChildId] = useState<"" | number>("");
  const [isAddChildDialogOpen, setIsAddChildDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isManageAccessDialogOpen, setIsManageAccessDialogOpen] = useState(false);
  const [isCreateTemplateDialogOpen, setIsCreateTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const { data: currentUser } = useQuery({ queryFn: getCurrentUser, queryKey: ["current-user"], retry: false });
  const { data: children = [], error: childrenError, isLoading: isLoadingChildren } = useQuery({ queryFn: getChildren, queryKey: ["children"] });
  const { data: itemTemplates = [], error: templatesError } = useQuery({ queryFn: getItemTemplates, queryKey: ["item-templates"] });
  const activeChildId = selectedChildId || children[0]?.childId || "";
  const { data: items = [], error: itemsError } = useQuery({
    enabled: activeChildId !== "",
    queryFn: () => getItems(activeChildId as number),
    queryKey: ["children", activeChildId, "items"]
  });
  const createChildMutation = useMutation({
    mutationFn: ({ firstName, lastName }: { firstName: string; lastName: string }) => createChild({ firstName, lastName: lastName || null }),
    onSuccess: async (child) => {
      setSelectedChildId(child.childId);
      setIsAddChildDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const createItemMutation = useMutation({
    mutationFn: ({ category, childId, name }: { category: string; childId: number; name: string }) => createItem(childId, { category, name }),
    onSuccess: async (_, variables) => {
      setIsAddDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const updateItemQuantitiesMutation = useMutation({
    mutationFn: ({
      childId,
      homeQuantity,
      itemId,
      kindergartenQuantity
    }: Pick<Item, "homeQuantity" | "kindergartenQuantity"> & { childId: number; itemId: number }) =>
      updateItemQuantities(childId, itemId, { homeQuantity, kindergartenQuantity }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const deleteItemMutation = useMutation({
    mutationFn: ({ childId, itemId }: { childId: number; itemId: number }) => deleteItem(childId, itemId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const deleteChildMutation = useMutation({
    mutationFn: deleteChild,
    onSuccess: async () => {
      setSelectedChildId("");
      setIsManageAccessDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const revokeChildAccessMutation = useMutation({
    mutationFn: ({ childId, parentUserId }: { childId: number; parentUserId: number }) => revokeChildAccess(childId, parentUserId),
    onSuccess: async (_, variables) => {
      if (variables.parentUserId === currentUser?.userId) setSelectedChildId("");
      setIsManageAccessDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const shareChildMutation = useMutation({
    mutationFn: ({ childId, email }: { childId: number; email: string }) => shareChild(childId, { email }),
    onSuccess: async () => {
      setIsShareDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const createItemTemplateMutation = useMutation({
    mutationFn: ({ childId, name }: { childId: number; name: string }) => createItemTemplate(childId, { name }),
    onSuccess: async () => {
      setIsCreateTemplateDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["item-templates"] });
    }
  });
  const applyItemTemplateMutation = useMutation({
    mutationFn: ({ childId, itemTemplateId }: { childId: number; itemTemplateId: number }) => applyItemTemplate(childId, itemTemplateId),
    onSuccess: async (_, variables) => {
      setSelectedTemplateId("");
      await queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const deleteItemTemplateMutation = useMutation({
    mutationFn: deleteItemTemplate,
    onSuccess: async () => {
      setSelectedTemplateId("");
      await queryClient.invalidateQueries({ queryKey: ["item-templates"] });
    }
  });
  const selectedChild = children.find((child) => child.childId === activeChildId);
  const selectedTemplate = itemTemplates.find((template) => template.itemTemplateId === Number(selectedTemplateId));
  const currentDate = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", weekday: "long" }).format(new Date()).toUpperCase();
  const homeCount = items.reduce((total, item) => total + item.homeQuantity, 0);
  const kindergartenCount = items.reduce((total, item) => total + item.kindergartenQuantity, 0);

  const updateItemQuantitiesForChild = (item: Item, quantities: Pick<Item, "homeQuantity" | "kindergartenQuantity">) => {
    if (activeChildId === "") return;
    updateItemQuantitiesMutation.mutate({ childId: activeChildId, itemId: item.itemId, ...quantities });
  };

  const removeItem = (item: Item) => {
    if (activeChildId === "") return;
    deleteItemMutation.mutate({ childId: activeChildId, itemId: item.itemId });
  };

  const deleteActiveChild = () => {
    if (activeChildId === "") return;
    deleteChildMutation.mutate(activeChildId);
  };

  const revokeAccess = (parentUserId: number) => {
    if (activeChildId === "") return;
    revokeChildAccessMutation.mutate({ childId: activeChildId, parentUserId });
  };

  const addItem = ({ category, name }: AddItemFormValues) => {
    if (activeChildId === "") return;
    createItemMutation.mutate({ category: category.trim(), childId: activeChildId, name: name.trim() });
  };

  const addChild = ({ firstName, lastName }: AddChildFormValues) => {
    createChildMutation.mutate({ firstName: firstName.trim(), lastName: lastName.trim() });
  };

  const shareActiveChild = ({ email }: ShareChildFormValues) => {
    if (activeChildId === "") return;
    shareChildMutation.mutate({ childId: activeChildId, email: email.trim() });
  };

  const saveItemTemplate = ({ name }: CreateItemTemplateFormValues) => {
    if (activeChildId === "") return;
    createItemTemplateMutation.mutate({ childId: activeChildId, name: name.trim() });
  };

  const applySelectedTemplate = () => {
    if (activeChildId === "" || !selectedTemplateId) return;
    applyItemTemplateMutation.mutate({ childId: activeChildId, itemTemplateId: Number(selectedTemplateId) });
  };

  const removeSelectedTemplate = () => {
    if (!selectedTemplate || selectedTemplate.createdByUserId !== currentUser?.userId) return;
    deleteItemTemplateMutation.mutate(selectedTemplate.itemTemplateId);
  };

  const shareErrorMessage =
    shareChildMutation.error instanceof ProblemDetailsError
      ? shareChildMutation.error.detail
      : shareChildMutation.isError
        ? "Det gick inte att dela barnet. Försök igen."
        : undefined;

  return (
    <>
      <Helmet title={selectedChild ? `${selectedChild.firstName}s saker` : "Dina barn"} />
      <Box component="section" sx={{ margin: "0 auto", maxWidth: 1120, px: { sm: 4, xs: 2 }, py: { sm: 5, xs: 3 } }}>
        <ChildDashboardHeader
          activeChildId={activeChildId}
          children={children}
          currentDate={currentDate}
          currentUserId={currentUser?.userId}
          selectedChild={selectedChild}
          onAddChild={() => setIsAddChildDialogOpen(true)}
          onManageChild={() => setIsManageAccessDialogOpen(true)}
          onSelectChild={setSelectedChildId}
          onShareChild={() => setIsShareDialogOpen(true)}
        />
        {isLoadingChildren ? (
          <Box sx={{ display: "grid", minHeight: 240, placeItems: "center" }}>
            <CircularProgress aria-label="Laddar barn" />
          </Box>
        ) : (
          <>
            {children.length === 0 ? (
              <Paper sx={{ mt: 2, p: { sm: 4, xs: 3 }, textAlign: "center" }} variant="outlined">
                <Typography component="h2" variant="h6">
                  Lägg till ditt första barn
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Börja med att lägga till ett barn för att hålla koll på sakerna på förskolan.
                </Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => setIsAddChildDialogOpen(true)}>
                  Lägg till barn
                </Button>
              </Paper>
            ) : (
              <>
                <ItemTemplateControls
                  currentUserId={currentUser?.userId}
                  isApplyingTemplate={applyItemTemplateMutation.isPending}
                  isDeletingTemplate={deleteItemTemplateMutation.isPending}
                  itemTemplates={itemTemplates}
                  selectedTemplateId={selectedTemplateId}
                  onApplyTemplate={applySelectedTemplate}
                  onCreateTemplate={() => setIsCreateTemplateDialogOpen(true)}
                  onDeleteTemplate={removeSelectedTemplate}
                  onSelectTemplate={setSelectedTemplateId}
                />
                <TomorrowSummary atKindergartenCount={kindergartenCount} homeCount={homeCount} />
                <PackingList
                  isDeletingItemId={deleteItemMutation.isPending ? deleteItemMutation.variables.itemId : undefined}
                  isUpdatingItemId={updateItemQuantitiesMutation.isPending ? updateItemQuantitiesMutation.variables.itemId : undefined}
                  items={items}
                  selectedChild={selectedChild}
                  onAddItem={() => setIsAddDialogOpen(true)}
                  onDeleteItem={removeItem}
                  onUpdateItemQuantities={updateItemQuantitiesForChild}
                />
              </>
            )}
          </>
        )}

        {(childrenError ||
          templatesError ||
          itemsError ||
          createChildMutation.error ||
          createItemMutation.error ||
          deleteItemMutation.error ||
          deleteChildMutation.error ||
          deleteItemTemplateMutation.error ||
          revokeChildAccessMutation.error ||
          updateItemQuantitiesMutation.error ||
          createItemTemplateMutation.error ||
          applyItemTemplateMutation.error) && (
          <Typography color="error.main" role="alert" sx={{ mt: 2 }}>
            Det gick inte att spara ändringarna. Försök igen.
          </Typography>
        )}
      </Box>
      <AddItemDialog isOpen={isAddDialogOpen} isPending={createItemMutation.isPending} onClose={() => setIsAddDialogOpen(false)} onSubmit={addItem} />
      <AddChildDialog
        isOpen={isAddChildDialogOpen}
        isPending={createChildMutation.isPending}
        onClose={() => setIsAddChildDialogOpen(false)}
        onSubmit={addChild}
      />
      <ShareChildDialog
        errorMessage={shareErrorMessage}
        isOpen={isShareDialogOpen}
        isPending={shareChildMutation.isPending}
        onClose={() => setIsShareDialogOpen(false)}
        onSubmit={shareActiveChild}
      />
      <ManageChildAccessDialog
        child={selectedChild}
        currentUserId={currentUser?.userId}
        errorMessage={
          deleteChildMutation.isError || revokeChildAccessMutation.isError ? "Det gick inte att ändra åtkomsten. Försök igen." : undefined
        }
        isDeletingChild={deleteChildMutation.isPending}
        isOpen={isManageAccessDialogOpen}
        isRevokingParentUserId={revokeChildAccessMutation.isPending ? revokeChildAccessMutation.variables.parentUserId : undefined}
        onClose={() => setIsManageAccessDialogOpen(false)}
        onDeleteChild={deleteActiveChild}
        onRevokeAccess={revokeAccess}
      />
      <CreateItemTemplateDialog
        isOpen={isCreateTemplateDialogOpen}
        isPending={createItemTemplateMutation.isPending}
        onClose={() => setIsCreateTemplateDialogOpen(false)}
        onSubmit={saveItemTemplate}
      />
    </>
  );
}
