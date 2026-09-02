namespace HomeHelper.Data;

public class Item
{
    public int ItemId { get; set; }
    public int ChildId { get; set; }
    public int? ItemTemplateEntryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int HomeQuantity { get; set; }
    public int KindergartenQuantity { get; set; }
    public Child Child { get; set; } = null!;
    public ItemTemplateEntry? ItemTemplateEntry { get; set; }
}

public class ItemTemplate
{
    public int ItemTemplateId { get; set; }
    public int ChildId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<ItemTemplateEntry> Entries { get; set; } = new List<ItemTemplateEntry>();
    public Child Child { get; set; } = null!;
}

public class ItemTemplateEntry
{
    public int ItemTemplateEntryId { get; set; }
    public int ItemTemplateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public ItemTemplate ItemTemplate { get; set; } = null!;
    public ICollection<Item> Items { get; set; } = new List<Item>();
}