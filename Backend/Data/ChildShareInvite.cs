namespace HomeHelper.Data;

public enum ChildShareInviteStatus
{
    Pending,
    Accepted,
    Declined
}

public class ChildShareInvite
{
    public int ChildShareInviteId { get; set; }
    public int ChildId { get; set; }
    public Child Child { get; set; } = null!;
    public string InvitedEmail { get; set; } = string.Empty;
    public string NormalizedInvitedEmail { get; set; } = string.Empty;
    public int InvitedByUserId { get; set; }
    public User InvitedByUser { get; set; } = null!;
    public ChildShareInviteStatus Status { get; set; } = ChildShareInviteStatus.Pending;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? RespondedAt { get; set; }
}
