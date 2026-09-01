import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Item } from "Src/api/Dto";

import { createChild, createItem, getChildren, getItems, getItemStatuses, updateItemStatus } from "Src/api/Children";
import AddChildDialog from "Src/components/Home/AddChildDialog";
import AddItemDialog from "Src/components/Home/AddItemDialog";
import ChildDashboardHeader from "Src/components/Home/ChildDashboardHeader";
import PackingList from "Src/components/Home/PackingList";
import TomorrowSummary from "Src/components/Home/TomorrowSummary";

export default function Index() {
  const queryClient = useQueryClient();
  const [selectedChildId, setSelectedChildId] = useState<"" | number>("");
  const [isAddChildDialogOpen, setIsAddChildDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChildFirstName, setNewChildFirstName] = useState("");
  const [newChildLastName, setNewChildLastName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const { data: children = [], error: childrenError } = useQuery({ queryFn: getChildren, queryKey: ["children"] });
  const { data: itemStatuses = [], error: statusesError } = useQuery({ queryFn: getItemStatuses, queryKey: ["item-statuses"] });
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
      setNewChildFirstName("");
      setNewChildLastName("");
      setIsAddChildDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const createItemMutation = useMutation({
    mutationFn: ({ category, childId, name }: { category: string; childId: number; name: string }) => createItem(childId, { category, name }),
    onSuccess: async (_, variables) => {
      setNewItemName("");
      setNewItemCategory("");
      setIsAddDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const updateItemStatusMutation = useMutation({
    mutationFn: ({ childId, itemId, status }: { childId: number; itemId: number; status: Item["status"] }) =>
      updateItemStatus(childId, itemId, { status }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const selectedChild = children.find((child) => child.childId === activeChildId);
  const currentDate = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", weekday: "long" }).format(new Date()).toUpperCase();
  const needsToBringStatus = itemStatuses.find((status) => status === "NeedsToBring");
  const atKindergartenStatus = itemStatuses.find((status) => status === "AtKindergarten");
  const bringTomorrow = items.filter((item) => item.status === needsToBringStatus);
  const atKindergarten = items.filter((item) => item.status === atKindergartenStatus);

  const cycleItemStatus = (item: Item) => {
    if (activeChildId === "" || itemStatuses.length === 0) return;
    const nextStatus = itemStatuses[(itemStatuses.indexOf(item.status) + 1) % itemStatuses.length]!;
    updateItemStatusMutation.mutate({ childId: activeChildId, itemId: item.itemId, status: nextStatus });
  };

  const addItem = () => {
    const itemName = newItemName.trim();
    const category = newItemCategory.trim();
    if (!itemName || !category || activeChildId === "") return;
    createItemMutation.mutate({ category, childId: activeChildId, name: itemName });
  };

  const addChild = () => {
    const firstName = newChildFirstName.trim();
    if (!firstName) return;
    createChildMutation.mutate({ firstName, lastName: newChildLastName.trim() });
  };

  return (
    <>
      <Helmet title={selectedChild ? `${selectedChild.firstName}'s things` : "Your children"} />
      <Box component="section" sx={{ margin: "0 auto", maxWidth: 1120, px: { sm: 4, xs: 2 }, py: { sm: 5, xs: 3 } }}>
        <ChildDashboardHeader
          activeChildId={activeChildId}
          children={children}
          currentDate={currentDate}
          selectedChild={selectedChild}
          onAddChild={() => setIsAddChildDialogOpen(true)}
          onSelectChild={setSelectedChildId}
        />
        <TomorrowSummary atKindergartenCount={atKindergarten.length} bringTomorrowCount={bringTomorrow.length} />
        <PackingList
          atKindergartenStatus={atKindergartenStatus}
          items={items}
          needsToBringStatus={needsToBringStatus}
          selectedChild={selectedChild}
          onAddItem={() => setIsAddDialogOpen(true)}
          onCycleItemStatus={cycleItemStatus}
        />

        {(childrenError ||
          statusesError ||
          itemsError ||
          createChildMutation.error ||
          createItemMutation.error ||
          updateItemStatusMutation.error) && (
          <Typography color="error.main" role="alert" sx={{ mt: 2 }}>
            We could not save your changes. Please try again.
          </Typography>
        )}
      </Box>
      <AddItemDialog
        category={newItemCategory}
        isOpen={isAddDialogOpen}
        isPending={createItemMutation.isPending}
        name={newItemName}
        onCategoryChange={setNewItemCategory}
        onClose={() => setIsAddDialogOpen(false)}
        onNameChange={setNewItemName}
        onSubmit={addItem}
      />
      <AddChildDialog
        firstName={newChildFirstName}
        isOpen={isAddChildDialogOpen}
        isPending={createChildMutation.isPending}
        lastName={newChildLastName}
        onClose={() => setIsAddChildDialogOpen(false)}
        onFirstNameChange={setNewChildFirstName}
        onLastNameChange={setNewChildLastName}
        onSubmit={addChild}
      />
    </>
  );
}
