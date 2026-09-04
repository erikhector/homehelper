import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Item } from "Src/api/Dto";

import { getCurrentUser } from "Src/api/Auth";
import {
  activateItemTemplate,
  cancelChildInvite,
  createChild,
  createItem,
  deleteChild,
  deleteItem,
  getChildren,
  getItems,
  getItemTemplates,
  revokeChildAccess,
  shareChild,
  updateItemQuantities
} from "Src/api/Children";

export default function useHomeDashboard(selectedChildId: "" | number) {
  const queryClient = useQueryClient();
  const currentUserQuery = useQuery({ queryFn: getCurrentUser, queryKey: ["current-user"], retry: false });
  const childrenQuery = useQuery({ queryFn: getChildren, queryKey: ["children"] });
  const activeChildId: "" | number = selectedChildId || childrenQuery.data?.[0]?.childId || "";
  const itemTemplatesQuery = useQuery({
    enabled: activeChildId !== "",
    queryFn: () => getItemTemplates(activeChildId as number),
    queryKey: ["children", activeChildId, "item-templates"]
  });
  const itemsQuery = useQuery({
    enabled: activeChildId !== "",
    queryFn: () => getItems(activeChildId as number),
    queryKey: ["children", activeChildId, "items"]
  });
  const createChildMutation = useMutation({
    mutationFn: ({ firstName, lastName }: { firstName: string; lastName: string }) => createChild({ firstName, lastName: lastName || null }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const createItemMutation = useMutation({
    mutationFn: ({ category, childId, name }: { category: string; childId: number; name: string }) => createItem(childId, { category, name }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
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
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const deleteItemMutation = useMutation({
    mutationFn: ({ childId, itemId }: { childId: number; itemId: number }) => deleteItem(childId, itemId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });
  const deleteChildMutation = useMutation({
    mutationFn: deleteChild,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const revokeChildAccessMutation = useMutation({
    mutationFn: ({ childId, parentUserId }: { childId: number; parentUserId: number }) => revokeChildAccess(childId, parentUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const shareChildMutation = useMutation({
    mutationFn: ({ childId, username }: { childId: number; username: string }) => shareChild(childId, { username }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const cancelChildInviteMutation = useMutation({
    mutationFn: ({ childId, inviteId }: { childId: number; inviteId: number }) => cancelChildInvite(childId, inviteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const activateItemTemplateMutation = useMutation({
    mutationFn: ({ childId, itemTemplateId }: { childId: number; itemTemplateId: number }) => activateItemTemplate(childId, itemTemplateId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
      void queryClient.invalidateQueries({ queryKey: ["children", variables.childId, "items"] });
    }
  });

  return {
    activateItemTemplateMutation,
    activeChildId,
    cancelChildInviteMutation,
    childrenQuery,
    createChildMutation,
    createItemMutation,
    currentUserQuery,
    deleteChildMutation,
    deleteItemMutation,
    itemsQuery,
    itemTemplatesQuery,
    revokeChildAccessMutation,
    shareChildMutation,
    updateItemQuantitiesMutation
  };
}
