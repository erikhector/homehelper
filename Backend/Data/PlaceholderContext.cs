using Dekiru.ApiUtils.Domain;
using Dekiru.ApiUtils.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HomeHelper.Data;

public class Placeholder
{
    public int PlaceholderId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class HomehelperContext(DbContextOptions<HomehelperContext> options, DomainHandlerProvider domainHandlerProvider) : DbContext(options)
{
    public DbSet<Child> Children => Set<Child>();
    public DbSet<Item> Items => Set<Item>();

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
        modelBuilder.Entity<Child>().Property(child => child.FirstName).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Child>().Property(child => child.LastName).HasMaxLength(100);
        modelBuilder.Entity<Item>().Property(item => item.Name).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Item>().Property(item => item.Category).HasMaxLength(50).IsRequired();
        modelBuilder.Entity<Item>().Property(item => item.Status).HasConversion<string>().HasMaxLength(30);
        modelBuilder.Entity<Item>().HasOne(item => item.Child).WithMany(child => child.Items).HasForeignKey(item => item.ChildId).OnDelete(DeleteBehavior.Cascade);
    }
}
