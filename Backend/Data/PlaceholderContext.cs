using Dekiru.ApiUtils.Domain;
using Dekiru.ApiUtils.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HomeHelper.Data;

public class Placeholder
{
    public int PlaceholderId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class User
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string NormalizedUsername { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? LastLoginAt { get; set; }
    public ICollection<ParentChildLink> ChildLinks { get; set; } = new List<ParentChildLink>();
}

public class HomehelperContext(DbContextOptions<HomehelperContext> options, DomainHandlerProvider domainHandlerProvider) : DbContext(options)
{
    public DbSet<Child> Children => Set<Child>();
    public DbSet<ChildShareInvite> ChildShareInvites => Set<ChildShareInvite>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemTemplate> ItemTemplates => Set<ItemTemplate>();
    public DbSet<ItemTemplateEntry> ItemTemplateEntries => Set<ItemTemplateEntry>();
    public DbSet<ParentChildLink> ParentChildLinks => Set<ParentChildLink>();
    public DbSet<User> Users => Set<User>();

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        throw new NotSupportedException("Use SaveChangesAsync instead");
    }

    public override int SaveChanges()
    {
        throw new NotSupportedException("Use SaveChangesAsync instead");
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        InterceptSave();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        InterceptSave();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private void InterceptSave()
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Deleted && entry.Entity is ISoftDeletable softDeletable)
            {
                entry.State = EntityState.Modified;
                softDeletable.Deleted = true;
            }

            if (entry.State == EntityState.Added && entry.Entity is ICreated createdEntity)
            {
                createdEntity.Created = DateTimeOffset.UtcNow;

                if (entry.Entity is IUpdated updatedEntity)
                {
                    updatedEntity.Updated = DateTimeOffset.UtcNow;
                }
            }

            else if (entry.State == EntityState.Modified && entry.Entity is IUpdated updatedEntity)
            {
                updatedEntity.Updated = DateTimeOffset.UtcNow;
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        domainHandlerProvider.RegisterQueryFilters(modelBuilder);
        modelBuilder.Entity<User>().HasIndex(user => user.NormalizedUsername).IsUnique();
        modelBuilder.Entity<User>().Property(user => user.Username).HasMaxLength(320).IsRequired();
        modelBuilder.Entity<User>().Property(user => user.NormalizedUsername).HasMaxLength(320).IsRequired();
        modelBuilder.Entity<User>().Property(user => user.PasswordHash).HasMaxLength(500).IsRequired();
        modelBuilder.Entity<User>().Property(user => user.DisplayName).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Child>().Property(child => child.FirstName).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Child>().Property(child => child.LastName).HasMaxLength(100);
        modelBuilder.Entity<Item>().Property(item => item.Name).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Item>().Property(item => item.Category).HasMaxLength(50).IsRequired();
        modelBuilder.Entity<Item>().Property(item => item.HomeQuantity).HasDefaultValue(0);
        modelBuilder.Entity<Item>().Property(item => item.KindergartenQuantity).HasDefaultValue(0);
        modelBuilder.Entity<Item>().HasOne(item => item.Child).WithMany(child => child.Items).HasForeignKey(item => item.ChildId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Item>().HasOne(item => item.ItemTemplateEntry).WithMany(entry => entry.Items).HasForeignKey(item => item.ItemTemplateEntryId).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<ItemTemplate>().Property(template => template.Name).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<ItemTemplate>().HasOne(template => template.Child).WithMany(child => child.ItemTemplates).HasForeignKey(template => template.ChildId).OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Child>().HasOne(child => child.ActiveItemTemplate).WithMany().HasForeignKey(child => child.ActiveItemTemplateId).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<ItemTemplateEntry>().Property(entry => entry.Name).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<ItemTemplateEntry>().Property(entry => entry.Category).HasMaxLength(50).IsRequired();
        modelBuilder.Entity<ItemTemplateEntry>().Property(entry => entry.Quantity).HasDefaultValue(0);
        modelBuilder.Entity<ItemTemplateEntry>().HasOne(entry => entry.ItemTemplate).WithMany(template => template.Entries).HasForeignKey(entry => entry.ItemTemplateId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ParentChildLink>().HasIndex(link => new { link.UserId, link.ChildId }).IsUnique();
        modelBuilder.Entity<ParentChildLink>().Property(link => link.Role).HasConversion<string>().HasMaxLength(20).IsRequired();
        modelBuilder.Entity<ParentChildLink>().HasOne(link => link.User).WithMany(user => user.ChildLinks).HasForeignKey(link => link.UserId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ParentChildLink>().HasOne(link => link.Child).WithMany(child => child.ParentLinks).HasForeignKey(link => link.ChildId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ChildShareInvite>().Property(invite => invite.InvitedUsername).HasMaxLength(320).IsRequired();
        modelBuilder.Entity<ChildShareInvite>().Property(invite => invite.NormalizedInvitedUsername).HasMaxLength(320).IsRequired();
        modelBuilder.Entity<ChildShareInvite>().Property(invite => invite.Status).HasConversion<string>().HasMaxLength(20).IsRequired();
        modelBuilder.Entity<ChildShareInvite>().HasOne(invite => invite.Child).WithMany(child => child.ShareInvites).HasForeignKey(invite => invite.ChildId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ChildShareInvite>().HasOne(invite => invite.InvitedByUser).WithMany().HasForeignKey(invite => invite.InvitedByUserId).OnDelete(DeleteBehavior.NoAction);
    }
}
