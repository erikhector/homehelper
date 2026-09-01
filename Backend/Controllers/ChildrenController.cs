using HomeHelper.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeHelper.Controllers;

public record CreateChildRequest(string FirstName, string? LastName);
public record CreateItemRequest(string Name, string Category);
public record UpdateItemStatusRequest(ItemStatus Status);

[Route("api/children")]
[ApiController]
public class ChildrenController(HomehelperContext context) : ControllerBase
{
    [HttpGet("item-statuses")]
    public ActionResult<ItemStatus[]> GetItemStatuses()
    {
        return Ok(Enum.GetValues<ItemStatus>());
    }

    [HttpGet]
    public async Task<ActionResult<List<Child>>> GetChildren(CancellationToken cancellationToken)
    {
        return await context.Set<Child>().AsNoTracking().OrderBy(child => child.FirstName).ToListAsync(cancellationToken);
    }

    [HttpPost]
    public async Task<ActionResult<Child>> CreateChild(CreateChildRequest request, CancellationToken cancellationToken)
    {
        var child = new Child { FirstName = request.FirstName.Trim(), LastName = request.LastName?.Trim() };
        context.Add(child);
        await context.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetChildren), new { childId = child.ChildId }, child);
    }

    [HttpGet("{childId:int}/items")]
    public async Task<ActionResult<List<Item>>> GetItems(int childId, CancellationToken cancellationToken)
    {
        var childExists = await context.Set<Child>().AnyAsync(child => child.ChildId == childId, cancellationToken);
        if (!childExists) return NotFound();

        return await context.Set<Item>().AsNoTracking().Where(item => item.ChildId == childId).OrderBy(item => item.Name).ToListAsync(cancellationToken);
    }

    [HttpPost("{childId:int}/items")]
    public async Task<ActionResult<Item>> CreateItem(int childId, CreateItemRequest request, CancellationToken cancellationToken)
    {
        var childExists = await context.Set<Child>().AnyAsync(child => child.ChildId == childId, cancellationToken);
        if (!childExists) return NotFound();

        var item = new Item { ChildId = childId, Name = request.Name.Trim(), Category = request.Category, Status = ItemStatus.NeedsToBring };
        context.Add(item);
        await context.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetItems), new { childId }, item);
    }

    [HttpPut("{childId:int}/items/{itemId:int}/status")]
    public async Task<ActionResult<Item>> UpdateItemStatus(int childId, int itemId, UpdateItemStatusRequest request, CancellationToken cancellationToken)
    {
        var item = await context.Set<Item>().SingleOrDefaultAsync(item => item.ChildId == childId && item.ItemId == itemId, cancellationToken);
        if (item is null) return NotFound();

        item.Status = request.Status;
        await context.SaveChangesAsync(cancellationToken);
        return Ok(item);
    }
}