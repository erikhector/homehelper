using System.Security.Claims;
using HomeHelper.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeHelper.Controllers;

public record CreateChildRequest(string FirstName, string? LastName);
public record CreateItemRequest(string Name, string Category);
public record UpdateItemQuantitiesRequest(int HomeQuantity, int KindergartenQuantity);
public record CreateItemTemplateRequest(string Name);
public record ShareChildRequest(string Email);

[Route("api/children")]
[ApiController]
[Authorize]
public class ChildrenController(HomehelperContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Child>>> GetChildren(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        return await context.Children.AsNoTracking()
            .Include(child => child.ParentLinks)
            .ThenInclude(link => link.User)
            .Where(child => child.ParentLinks.Any(link => link.UserId == userId))
            .OrderBy(child => child.FirstName)
            .ToListAsync(cancellationToken);
    }

    [HttpPost]
    public async Task<ActionResult<Child>> CreateChild(CreateChildRequest request, CancellationToken cancellationToken)
    {
        var child = new Child { FirstName = request.FirstName.Trim(), LastName = request.LastName?.Trim() };
        context.Add(child);
        context.ParentChildLinks.Add(new ParentChildLink { Child = child, UserId = GetUserId(), Role = ParentChildRole.Owner, CreatedAt = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetChildren), new { childId = child.ChildId }, child);
    }

    [HttpGet("{childId:int}/items")]
    public async Task<ActionResult<List<Item>>> GetItems(int childId, CancellationToken cancellationToken)
    {
        if (!await HasChildAccess(childId, cancellationToken)) return NotFound();

        return await context.Set<Item>().AsNoTracking().Where(item => item.ChildId == childId).OrderBy(item => item.Name).ToListAsync(cancellationToken);
    }

    [HttpPost("{childId:int}/items")]
    public async Task<ActionResult<Item>> CreateItem(int childId, CreateItemRequest request, CancellationToken cancellationToken)
    {
        if (!await HasChildAccess(childId, cancellationToken)) return NotFound();

        var item = new Item { ChildId = childId, Name = request.Name.Trim(), Category = request.Category.Trim() };
        context.Add(item);
        await context.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetItems), new { childId }, item);
    }

    [HttpDelete("{childId:int}/items/{itemId:int}")]
    public async Task<ActionResult> DeleteItem(int childId, int itemId, CancellationToken cancellationToken)
    {
        if (!await HasChildAccess(childId, cancellationToken)) return NotFound();

        var item = await context.Items.SingleOrDefaultAsync(item => item.ChildId == childId && item.ItemId == itemId, cancellationToken);
        if (item is null) return NotFound();

        context.Items.Remove(item);
        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPut("{childId:int}/items/{itemId:int}/quantities")]
    public async Task<ActionResult<Item>> UpdateItemQuantities(int childId, int itemId, UpdateItemQuantitiesRequest request, CancellationToken cancellationToken)
    {
        if (!await HasChildAccess(childId, cancellationToken)) return NotFound();
        if (request.HomeQuantity < 0 || request.KindergartenQuantity < 0) return BadRequest();

        var item = await context.Set<Item>().SingleOrDefaultAsync(item => item.ChildId == childId && item.ItemId == itemId, cancellationToken);
        if (item is null) return NotFound();

        item.HomeQuantity = request.HomeQuantity;
        item.KindergartenQuantity = request.KindergartenQuantity;
        await context.SaveChangesAsync(cancellationToken);
        return Ok(item);
    }

    [HttpGet("item-templates")]
    public async Task<ActionResult<List<ItemTemplate>>> GetItemTemplates(CancellationToken cancellationToken)
    {
        return await context.ItemTemplates.AsNoTracking().Include(template => template.Entries).OrderBy(template => template.Name).ToListAsync(cancellationToken);
    }

    [HttpPost("{childId:int}/item-templates")]
    public async Task<ActionResult<ItemTemplate>> CreateItemTemplate(int childId, CreateItemTemplateRequest request, CancellationToken cancellationToken)
    {
        if (!await HasChildAccess(childId, cancellationToken)) return NotFound();

        var entries = await context.Items.AsNoTracking().Where(item => item.ChildId == childId)
            .Select(item => new ItemTemplateEntry { Name = item.Name, Category = item.Category }).ToListAsync(cancellationToken);
        var template = new ItemTemplate { Name = request.Name.Trim(), CreatedByUserId = GetUserId(), Entries = entries };
        context.ItemTemplates.Add(template);
        await context.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetItemTemplates), template);
    }

    [HttpDelete("item-templates/{itemTemplateId:int}")]
    public async Task<ActionResult> DeleteItemTemplate(int itemTemplateId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var template = await context.ItemTemplates.SingleOrDefaultAsync(template => template.ItemTemplateId == itemTemplateId, cancellationToken);
        if (template is null || template.CreatedByUserId != userId) return NotFound();

        context.ItemTemplates.Remove(template);
        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{childId:int}/item-templates/{itemTemplateId:int}/apply")]
    public async Task<ActionResult<List<Item>>> ApplyItemTemplate(int childId, int itemTemplateId, CancellationToken cancellationToken)
    {
        if (!await HasChildAccess(childId, cancellationToken)) return NotFound();

        var template = await context.ItemTemplates.AsNoTracking().Include(itemTemplate => itemTemplate.Entries)
            .SingleOrDefaultAsync(itemTemplate => itemTemplate.ItemTemplateId == itemTemplateId, cancellationToken);
        if (template is null) return NotFound();

        var items = template.Entries.Select(entry => new Item { ChildId = childId, Name = entry.Name, Category = entry.Category }).ToList();
        context.Items.AddRange(items);
        await context.SaveChangesAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("{childId:int}/parents")]
    public async Task<ActionResult> ShareChild(int childId, ShareChildRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var isOwner = await context.ParentChildLinks.AnyAsync(link => link.ChildId == childId && link.UserId == userId && link.Role == ParentChildRole.Owner, cancellationToken);
        if (!isOwner) return NotFound();

        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var parent = await context.Users.SingleOrDefaultAsync(user => user.NormalizedEmail == normalizedEmail, cancellationToken);
        if (parent is null) return NotFound();

        var alreadyLinked = await context.ParentChildLinks.AnyAsync(link => link.ChildId == childId && link.UserId == parent.UserId, cancellationToken);
        if (alreadyLinked) return Conflict(new { detail = "This parent already has access to the child." });

        context.ParentChildLinks.Add(new ParentChildLink { ChildId = childId, UserId = parent.UserId, Role = ParentChildRole.Guardian, CreatedAt = DateTimeOffset.UtcNow });
        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private Task<bool> HasChildAccess(int childId, CancellationToken cancellationToken) =>
        context.ParentChildLinks.AnyAsync(link => link.ChildId == childId && link.UserId == GetUserId(), cancellationToken);
}