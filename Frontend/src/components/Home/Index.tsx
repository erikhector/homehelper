import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Typography } from "@mui/material";

import type { Item } from "Src/api/Dto";
import type { AddChildFormValues } from "Src/components/Home/AddChildDialog";
import type { AddItemFormValues } from "Src/components/Home/AddItemDialog";
import type { CreateItemTemplateFormValues } from "Src/components/Home/CreateItemTemplateDialog";
import type { ShareChildFormValues } from "Src/components/Home/ShareChildDialog";

import { ProblemDetailsError } from "Src/api/HttpClient";

import ChildDashboardHeader from "Src/components/Home/ChildDashboardHeader";
import HomeDashboardContent from "Src/components/Home/HomeDashboardContent";
import HomeDialogs from "Src/components/Home/HomeDialogs";

import useHomeDashboard from "Src/hooks/useHomeDashboard";

export default function Index() {
  const [selectedChildId, setSelectedChildId] = useState<"" | number>("");
  const [isAddChildDialogOpen, setIsAddChildDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isManageAccessDialogOpen, setIsManageAccessDialogOpen] = useState(false);
  const [isCreateTemplateDialogOpen, setIsCreateTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const dashboard = useHomeDashboard(selectedChildId);
  const children = dashboard.childrenQuery.data ?? [];
  const itemTemplates = dashboard.itemTemplatesQuery.data ?? [];
  const items = dashboard.itemsQuery.data ?? [];
  const selectedChild = children.find((child) => child.childId === dashboard.activeChildId);
  const selectedTemplate = itemTemplates.find((template) => template.itemTemplateId === Number(selectedTemplateId));
  const currentDate = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", weekday: "long" }).format(new Date()).toUpperCase();

  const addChild = ({ firstName, lastName }: AddChildFormValues) => {
    dashboard.createChildMutation.mutate(
      { firstName: firstName.trim(), lastName: lastName.trim() },
      {
        onSuccess: (child) => {
          setSelectedChildId(child.childId);
          setIsAddChildDialogOpen(false);
        }
      }
    );
  };

  const addItem = ({ category, name }: AddItemFormValues) => {
    if (dashboard.activeChildId === "") return;
    dashboard.createItemMutation.mutate(
      { category: category.trim(), childId: dashboard.activeChildId, name: name.trim() },
      { onSuccess: () => setIsAddItemDialogOpen(false) }
    );
  };

  const updateItemQuantities = (item: Item, quantities: Pick<Item, "homeQuantity" | "kindergartenQuantity">) => {
    if (dashboard.activeChildId === "") return;
    dashboard.updateItemQuantitiesMutation.mutate({ childId: dashboard.activeChildId, itemId: item.itemId, ...quantities });
  };

  const deleteItem = (item: Item) => {
    if (dashboard.activeChildId === "") return;
    dashboard.deleteItemMutation.mutate({ childId: dashboard.activeChildId, itemId: item.itemId });
  };

  const saveItemTemplate = ({ name }: CreateItemTemplateFormValues) => {
    if (dashboard.activeChildId === "") return;
    dashboard.createItemTemplateMutation.mutate(
      { childId: dashboard.activeChildId, name: name.trim() },
      { onSuccess: () => setIsCreateTemplateDialogOpen(false) }
    );
  };

  const shareActiveChild = ({ email }: ShareChildFormValues) => {
    if (dashboard.activeChildId === "") return;
    dashboard.shareChildMutation.mutate({ childId: dashboard.activeChildId, email: email.trim() }, { onSuccess: () => setIsShareDialogOpen(false) });
  };

  const applySelectedTemplate = () => {
    if (dashboard.activeChildId === "" || !selectedTemplateId) return;
    dashboard.applyItemTemplateMutation.mutate(
      { childId: dashboard.activeChildId, itemTemplateId: Number(selectedTemplateId) },
      { onSuccess: () => setSelectedTemplateId("") }
    );
  };

  const removeSelectedTemplate = () => {
    if (!selectedTemplate || selectedTemplate.createdByUserId !== dashboard.currentUserQuery.data?.userId) return;
    dashboard.deleteItemTemplateMutation.mutate(selectedTemplate.itemTemplateId, { onSuccess: () => setSelectedTemplateId("") });
  };

  const deleteActiveChild = () => {
    if (dashboard.activeChildId === "") return;
    dashboard.deleteChildMutation.mutate(dashboard.activeChildId, {
      onSuccess: () => {
        setSelectedChildId("");
        setIsManageAccessDialogOpen(false);
      }
    });
  };

  const revokeAccess = (parentUserId: number) => {
    if (dashboard.activeChildId === "") return;
    dashboard.revokeChildAccessMutation.mutate(
      { childId: dashboard.activeChildId, parentUserId },
      {
        onSuccess: () => {
          if (parentUserId === dashboard.currentUserQuery.data?.userId) setSelectedChildId("");
          setIsManageAccessDialogOpen(false);
        }
      }
    );
  };

  let shareErrorMessage: string | undefined;
  if (dashboard.shareChildMutation.error instanceof ProblemDetailsError) {
    shareErrorMessage = dashboard.shareChildMutation.error.detail;
  } else if (dashboard.shareChildMutation.isError) {
    shareErrorMessage = "Det gick inte att dela barnet. Försök igen.";
  }
  const hasDashboardError = [
    dashboard.childrenQuery.error,
    dashboard.itemTemplatesQuery.error,
    dashboard.itemsQuery.error,
    dashboard.createChildMutation.error,
    dashboard.createItemMutation.error,
    dashboard.deleteItemMutation.error,
    dashboard.deleteItemTemplateMutation.error,
    dashboard.updateItemQuantitiesMutation.error,
    dashboard.createItemTemplateMutation.error,
    dashboard.applyItemTemplateMutation.error
  ].some(Boolean);

  return (
    <>
      <Helmet title={selectedChild ? `${selectedChild.firstName}s saker` : "Dina barn"} />
      <Box component="section" sx={{ margin: "0 auto", maxWidth: 1120, px: { sm: 4, xs: 2 }, py: { sm: 5, xs: 3 } }}>
        <ChildDashboardHeader
          activeChildId={dashboard.activeChildId}
          childProfiles={children}
          currentDate={currentDate}
          currentUserId={dashboard.currentUserQuery.data?.userId}
          selectedChild={selectedChild}
          onAddChild={() => setIsAddChildDialogOpen(true)}
          onManageChild={() => setIsManageAccessDialogOpen(true)}
          onSelectChild={setSelectedChildId}
          onShareChild={() => setIsShareDialogOpen(true)}
        />
        <HomeDashboardContent
          childProfiles={children}
          currentUserId={dashboard.currentUserQuery.data?.userId}
          isApplyingTemplate={dashboard.applyItemTemplateMutation.isPending}
          isDeletingItemId={dashboard.deleteItemMutation.isPending ? dashboard.deleteItemMutation.variables.itemId : undefined}
          isDeletingTemplate={dashboard.deleteItemTemplateMutation.isPending}
          isLoadingChildren={dashboard.childrenQuery.isLoading}
          isUpdatingItemId={dashboard.updateItemQuantitiesMutation.isPending ? dashboard.updateItemQuantitiesMutation.variables.itemId : undefined}
          items={items}
          itemTemplates={itemTemplates}
          selectedChild={selectedChild}
          selectedTemplateId={selectedTemplateId}
          onAddChild={() => setIsAddChildDialogOpen(true)}
          onAddItem={() => setIsAddItemDialogOpen(true)}
          onApplyTemplate={applySelectedTemplate}
          onCreateTemplate={() => setIsCreateTemplateDialogOpen(true)}
          onDeleteItem={deleteItem}
          onDeleteTemplate={removeSelectedTemplate}
          onSelectTemplate={setSelectedTemplateId}
          onUpdateItemQuantities={updateItemQuantities}
        />
        {hasDashboardError && (
          <Typography color="error.main" role="alert" sx={{ mt: 2 }}>
            Det gick inte att spara ändringarna. Försök igen.
          </Typography>
        )}
      </Box>
      <HomeDialogs
        currentUserId={dashboard.currentUserQuery.data?.userId}
        isAddChildDialogOpen={isAddChildDialogOpen}
        isAddItemDialogOpen={isAddItemDialogOpen}
        isCreateTemplateDialogOpen={isCreateTemplateDialogOpen}
        isCreatingChild={dashboard.createChildMutation.isPending}
        isCreatingItem={dashboard.createItemMutation.isPending}
        isCreatingTemplate={dashboard.createItemTemplateMutation.isPending}
        isDeletingChild={dashboard.deleteChildMutation.isPending}
        isManageAccessDialogOpen={isManageAccessDialogOpen}
        isRevokingParentUserId={
          dashboard.revokeChildAccessMutation.isPending ? dashboard.revokeChildAccessMutation.variables.parentUserId : undefined
        }
        isShareDialogOpen={isShareDialogOpen}
        isSharingChild={dashboard.shareChildMutation.isPending}
        manageAccessErrorMessage={
          dashboard.deleteChildMutation.isError || dashboard.revokeChildAccessMutation.isError
            ? "Det gick inte att ändra åtkomsten. Försök igen."
            : undefined
        }
        selectedChild={selectedChild}
        shareErrorMessage={shareErrorMessage}
        onAddChild={addChild}
        onAddItem={addItem}
        onCloseAddChild={() => setIsAddChildDialogOpen(false)}
        onCloseAddItem={() => setIsAddItemDialogOpen(false)}
        onCloseCreateTemplate={() => setIsCreateTemplateDialogOpen(false)}
        onCloseManageAccess={() => setIsManageAccessDialogOpen(false)}
        onCloseShare={() => setIsShareDialogOpen(false)}
        onDeleteChild={deleteActiveChild}
        onRevokeAccess={revokeAccess}
        onSaveTemplate={saveItemTemplate}
        onShareChild={shareActiveChild}
      />
    </>
  );
}
