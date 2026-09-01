namespace HomeHelper.Data;

public enum ItemStatus
{
    AtKindergarten,
    NeedsToBring,
    AtHome
}

public class Item
{
    public int ItemId { get; set; }
    public int ChildId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public ItemStatus Status { get; set; }
    public Child Child { get; set; } = null!;
}