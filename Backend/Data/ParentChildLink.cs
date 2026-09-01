namespace HomeHelper.Data;

public enum ParentChildRole
{
    Owner,
    Guardian
}

public class ParentChildLink
{
    public int ParentChildLinkId { get; set; }
    public int UserId { get; set; }
    public int ChildId { get; set; }
    public ParentChildRole Role { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public User User { get; set; } = null!;
    public Child Child { get; set; } = null!;
}