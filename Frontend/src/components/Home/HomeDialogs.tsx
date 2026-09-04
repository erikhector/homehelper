import type { Child } from "Src/api/Dto";
import type { AddChildFormValues } from "Src/components/Home/AddChildDialog";
import type { AddItemFormValues } from "Src/components/Home/AddItemDialog";
import type { ShareChildFormValues } from "Src/components/Home/ShareChildDialog";

import AddChildDialog from "Src/components/Home/AddChildDialog";
import AddItemDialog from "Src/components/Home/AddItemDialog";
import ManageChildAccessDialog from "Src/components/Home/ManageChildAccessDialog";
import ShareChildDialog from "Src/components/Home/ShareChildDialog";

interface HomeDialogsProps {
  currentUserId: number | undefined;
  isAddChildDialogOpen: boolean;
  isAddItemDialogOpen: boolean;
  isCancelingInviteId: number | undefined;
  isCreatingChild: boolean;
  isCreatingItem: boolean;
  isDeletingChild: boolean;
  isManageAccessDialogOpen: boolean;
  isRevokingParentUserId: number | undefined;
  isShareDialogOpen: boolean;
  isSharingChild: boolean;
  manageAccessErrorMessage: string | undefined;
  onAddChild: (values: AddChildFormValues) => void;
  onAddItem: (values: AddItemFormValues) => void;
  onCancelInvite: (inviteId: number) => void;
  onCloseAddChild: () => void;
  onCloseAddItem: () => void;
  onCloseManageAccess: () => void;
  onCloseShare: () => void;
  onDeleteChild: () => void;
  onRevokeAccess: (parentUserId: number) => void;
  onShareChild: (values: ShareChildFormValues) => void;
  selectedChild: Child | undefined;
  shareErrorMessage: string | undefined;
}

export default function HomeDialogs({
  currentUserId,
  isAddChildDialogOpen,
  isAddItemDialogOpen,
  isCancelingInviteId,
  isCreatingChild,
  isCreatingItem,
  isDeletingChild,
  isManageAccessDialogOpen,
  isRevokingParentUserId,
  isShareDialogOpen,
  isSharingChild,
  manageAccessErrorMessage,
  onAddChild,
  onAddItem,
  onCancelInvite,
  onCloseAddChild,
  onCloseAddItem,
  onCloseManageAccess,
  onCloseShare,
  onDeleteChild,
  onRevokeAccess,
  onShareChild,
  selectedChild,
  shareErrorMessage
}: HomeDialogsProps) {
  return (
    <>
      <AddItemDialog isOpen={isAddItemDialogOpen} isPending={isCreatingItem} onClose={onCloseAddItem} onSubmit={onAddItem} />
      <AddChildDialog isOpen={isAddChildDialogOpen} isPending={isCreatingChild} onClose={onCloseAddChild} onSubmit={onAddChild} />
      <ShareChildDialog
        errorMessage={shareErrorMessage}
        isOpen={isShareDialogOpen}
        isPending={isSharingChild}
        onClose={onCloseShare}
        onSubmit={onShareChild}
      />
      <ManageChildAccessDialog
        child={selectedChild}
        currentUserId={currentUserId}
        errorMessage={manageAccessErrorMessage}
        isCancelingInviteId={isCancelingInviteId}
        isDeletingChild={isDeletingChild}
        isOpen={isManageAccessDialogOpen}
        isRevokingParentUserId={isRevokingParentUserId}
        onCancelInvite={onCancelInvite}
        onClose={onCloseManageAccess}
        onDeleteChild={onDeleteChild}
        onRevokeAccess={onRevokeAccess}
      />
    </>
  );
}
