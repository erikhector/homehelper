using System.Security.Claims;
using HomeHelper.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeHelper.Controllers;

public record CreateChildRequest(string FirstName, string? LastName);
public record CreateItemRequest(string Name, string Category);
public record UpdateItemQuantitiesRequest(int HomeQuantity, int KindergartenQuantity);
public record ItemTemplateEntryRequest(string Name, string Category, int Quantity);
public record SaveItemTemplateRequest(string Name, List<ItemTemplateEntryRequest> Entries);
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
            .Where(child => child.ParentLinks.Any(link => link.UserId == userId))
            .OrderBy(child => child.FirstName)
            .Select(child => new Child
            {
                ActiveItemTemplateId = child.ActiveItemTemplateId,
                ChildId = child.ChildId,
                FirstName = child.FirstName,
                LastName = child.LastName,
                ParentLinks = child.ParentLinks.Select(link => new ParentChildLink
                {
                    ChildId = link.ChildId,
                    CreatedAt = link.CreatedAt,
                    ParentChildLinkId = link.ParentChildLinkId,
                    Role = link.Role,
                    UserId = link.UserId,
                    User = new User
                    {
                        DisplayName = link.User.DisplayName,
                        Email = link.User.Email,
                        UserId = link.User.UserId
                    }
                }).ToList()
            })
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

    [HttpDelete("{childId:int}")]
    public async Task<ActionResult> DeleteChild(int childId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var isOwner = await context.ParentChildLinks.AnyAsync(
            link => link.ChildId == childId && link.UserId == userId && link.Role == ParentChildRole.Owner,
            cancellationToken);
        if (!isOwner) return NotFound();

        await context.ItemTemplates.Where(template => template.ChildId == childId).ExecuteDeleteAsync(cancellationToken);
        var deletedChildren = await context.Children.Where(child => child.ChildId == childId).ExecuteDeleteAsync(cancellationToken);
        if (deletedChildren == 0) return NotFound();

        return NoContent();
    }

    [HttpGet("{childId:int}/items")]
    public async Task<ActionResult<List<Item>>> GetItems(int childId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();

        return await context.Items.AsNoTracking()
            .Where(item => item.ChildId == childId)
            .OrderBy(item => item.Name)
            .Select(item => new Item
            {
                Category = item.Category,
                ChildId = item.ChildId,
                HomeQuantity = item.HomeQuantity,
                ItemId = item.ItemId,
                ItemTemplateEntryId = item.ItemTemplateEntryId,
                KindergartenQuantity = item.KindergartenQuantity,
                Name = item.Name,
                ItemTemplateEntry = item.ItemTemplateEntry == null
                    ? null
                    : new ItemTemplateEntry
                    {
                        Category = item.ItemTemplateEntry.Category,
                        ItemTemplateEntryId = item.ItemTemplateEntry.ItemTemplateEntryId,
                        ItemTemplateId = item.ItemTemplateEntry.ItemTemplateId,
                        Name = item.ItemTemplateEntry.Name,
                        Quantity = item.ItemTemplateEntry.Quantity
                    }
            })
            .ToListAsync(cancellationToken);
    }

    [HttpPost("{childId:int}/items")]
    public async Task<ActionResult<Item>> CreateItem(int childId, CreateItemRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();

        var item = new Item { ChildId = childId, Name = request.Name.Trim(), Category = request.Category.Trim() };
        context.Add(item);
        await context.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetItems), new { childId }, item);
    }

    [HttpDelete("{childId:int}/items/{itemId:int}")]
    public async Task<ActionResult> DeleteItem(int childId, int itemId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();

        var deletedItems = await context.Items.Where(item => item.ChildId == childId && item.ItemId == itemId).ExecuteDeleteAsync(cancellationToken);
        if (deletedItems == 0) return NotFound();

        return NoContent();
    }

    [HttpPut("{childId:int}/items/{itemId:int}/quantities")]
    public async Task<ActionResult<Item>> UpdateItemQuantities(int childId, int itemId, UpdateItemQuantitiesRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();
        if (request.HomeQuantity < 0 || request.KindergartenQuantity < 0) return BadRequest();

        var item = await context.Set<Item>().SingleOrDefaultAsync(item => item.ChildId == childId && item.ItemId == itemId, cancellationToken);
        if (item is null) return NotFound();

        item.HomeQuantity = request.HomeQuantity;
        item.KindergartenQuantity = request.KindergartenQuantity;
        await context.SaveChangesAsync(cancellationToken);
        return Ok(item);
    }

    [HttpGet("{childId:int}/item-templates")]
    public async Task<ActionResult<List<ItemTemplate>>> GetItemTemplates(int childId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();

        return await context.ItemTemplates.AsNoTracking()
            .Where(template => template.ChildId == childId)
            .OrderBy(template => template.Name)
            .Select(template => new ItemTemplate
            {
                ChildId = template.ChildId,
                Entries = template.Entries.Select(entry => new ItemTemplateEntry
                {
                    Category = entry.Category,
                    ItemTemplateEntryId = entry.ItemTemplateEntryId,
                    ItemTemplateId = entry.ItemTemplateId,
                    Name = entry.Name,
                    Quantity = entry.Quantity
                }).ToList(),
                ItemTemplateId = template.ItemTemplateId,
                Name = template.Name
            })
            .ToListAsync(cancellationToken);
    }

    [HttpPost("{childId:int}/item-templates")]
    public async Task<ActionResult<ItemTemplate>> CreateItemTemplate(int childId, SaveItemTemplateRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();
        if (!IsValidTemplate(request)) return BadRequest();

        var template = new ItemTemplate { ChildId = childId, Name = request.Name.Trim(), Entries = CreateTemplateEntries(request.Entries) };
        context.ItemTemplates.Add(template);
        await context.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetItemTemplates), new { childId }, template);
    }

    [HttpPut("{childId:int}/item-templates/{itemTemplateId:int}")]
    public async Task<ActionResult<ItemTemplate>> UpdateItemTemplate(int childId, int itemTemplateId, SaveItemTemplateRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();
        if (!IsValidTemplate(request)) return BadRequest();

        var template = await context.ItemTemplates.Include(itemTemplate => itemTemplate.Entries)
            .SingleOrDefaultAsync(itemTemplate => itemTemplate.ChildId == childId && itemTemplate.ItemTemplateId == itemTemplateId, cancellationToken);
        if (template is null) return NotFound();

        template.Name = request.Name.Trim();
        context.ItemTemplateEntries.RemoveRange(template.Entries);
        template.Entries = CreateTemplateEntries(request.Entries);
        await context.SaveChangesAsync(cancellationToken);

        var child = await context.Children.SingleAsync(itemChild => itemChild.ChildId == childId, cancellationToken);
        if (child.ActiveItemTemplateId == template.ItemTemplateId)
        {
            await context.Items.Where(item => item.ChildId == childId).ExecuteDeleteAsync(cancellationToken);
            context.Items.AddRange(template.Entries.Select(entry => new Item
            {
                ChildId = childId,
                ItemTemplateEntryId = entry.ItemTemplateEntryId,
                Name = entry.Name,
                Category = entry.Category
            }));
            await context.SaveChangesAsync(cancellationToken);
        }

        return Ok(template);
    }

    [HttpDelete("{childId:int}/item-templates/{itemTemplateId:int}")]
    public async Task<ActionResult> DeleteItemTemplate(int childId, int itemTemplateId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();

        var deletedTemplates = await context.ItemTemplates
            .Where(itemTemplate => itemTemplate.ChildId == childId && itemTemplate.ItemTemplateId == itemTemplateId)
            .ExecuteDeleteAsync(cancellationToken);
        if (deletedTemplates == 0) return NotFound();

        return NoContent();
    }

    [HttpPost("{childId:int}/item-templates/{itemTemplateId:int}/activate")]
    public async Task<ActionResult<List<Item>>> ActivateItemTemplate(int childId, int itemTemplateId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (!await HasChildAccess(childId, userId, cancellationToken)) return NotFound();

        var template = await context.ItemTemplates.Include(itemTemplate => itemTemplate.Entries)
            .SingleOrDefaultAsync(itemTemplate => itemTemplate.ChildId == childId && itemTemplate.ItemTemplateId == itemTemplateId, cancellationToken);
        if (template is null) return NotFound();

        await context.Items.Where(item => item.ChildId == childId).ExecuteDeleteAsync(cancellationToken);
        var items = template.Entries.Select(entry => new Item
        {
            ChildId = childId,
            ItemTemplateEntryId = entry.ItemTemplateEntryId,
            Name = entry.Name,
            Category = entry.Category
        }).ToList();
        context.Items.AddRange(items);
        var child = await context.Children.SingleAsync(itemChild => itemChild.ChildId == childId, cancellationToken);
        child.ActiveItemTemplateId = template.ItemTemplateId;
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

    [HttpDelete("{childId:int}/parents/{parentUserId:int}")]
    public async Task<ActionResult> RevokeChildAccess(int childId, int parentUserId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var link = await context.ParentChildLinks.SingleOrDefaultAsync(
            parentLink => parentLink.ChildId == childId && parentLink.UserId == parentUserId,
            cancellationToken);
        if (link is null) return NotFound();

        var isOwner = await context.ParentChildLinks.AnyAsync(
            parentLink => parentLink.ChildId == childId && parentLink.UserId == userId && parentLink.Role == ParentChildRole.Owner,
            cancellationToken);
        var isRevokingOwnGuardianAccess = parentUserId == userId && link.Role == ParentChildRole.Guardian;
        if (!isOwner && !isRevokingOwnGuardianAccess) return NotFound();
        if (link.Role == ParentChildRole.Owner) return Conflict(new { detail = "The child owner cannot be removed." });

        context.ParentChildLinks.Remove(link);
        await context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private Task<bool> HasChildAccess(int childId, int userId, CancellationToken cancellationToken) =>
        context.ParentChildLinks.AnyAsync(link => link.ChildId == childId && link.UserId == userId, cancellationToken);

    private static bool IsValidTemplate(SaveItemTemplateRequest request) =>
        !string.IsNullOrWhiteSpace(request.Name) && request.Entries.Count > 0 && request.Entries.All(entry =>
            !string.IsNullOrWhiteSpace(entry.Name) && !string.IsNullOrWhiteSpace(entry.Category) && entry.Quantity >= 0);

    private static List<ItemTemplateEntry> CreateTemplateEntries(IEnumerable<ItemTemplateEntryRequest> entries) =>
        entries.Select(entry => new ItemTemplateEntry
        {
            Name = entry.Name.Trim(),
            Category = entry.Category.Trim(),
            Quantity = entry.Quantity
        }).ToList();
}