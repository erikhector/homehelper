import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { acceptChildInvite, declineChildInvite, getReceivedInvites } from "Src/api/Children";

export default function useReceivedInvites(enabled: boolean) {
  const queryClient = useQueryClient();
  const receivedInvitesQuery = useQuery({ enabled, queryFn: getReceivedInvites, queryKey: ["invites", "received"] });
  const acceptInviteMutation = useMutation({
    mutationFn: acceptChildInvite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invites", "received"] });
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    }
  });
  const declineInviteMutation = useMutation({
    mutationFn: declineChildInvite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invites", "received"] });
    }
  });

  return { acceptInviteMutation, declineInviteMutation, receivedInvitesQuery };
}
