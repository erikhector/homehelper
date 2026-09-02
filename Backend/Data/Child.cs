namespace HomeHelper.Data;

public class Child
{
    public int ChildId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public int? ActiveItemTemplateId { get; set; }
    public ItemTemplate? ActiveItemTemplate { get; set; }
    public ICollection<Item> Items { get; set; } = new List<Item>();
    public ICollection<ItemTemplate> ItemTemplates { get; set; } = new List<ItemTemplate>();
    public ICollection<ParentChildLink> ParentLinks { get; set; } = new List<ParentChildLink>();
}