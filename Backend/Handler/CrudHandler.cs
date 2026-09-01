using Dekiru.ApiGenerator.Abstractions;
using Dekiru.ApiUtils.Domain;
using Dekiru.ApiUtils.Interfaces;
using Dekiru.DtoGenerator.Abstractions;
using Dekiru.Hermes.Abstractions;
using Dekiru.Hermes.Abstractions.Interfaces;
using Dekiru.QueryFilter.Extensions;
using HomeHelper.Services;

namespace HomeHelper.Handler;

[Handler]
public class GetHandler<TEntity>(ContextService context) : IQueryHandler<GetRequest<int, TEntity>, TEntity> where TEntity : class
{
    public async Task<TEntity> Handle(GetRequest<int, TEntity> request, CancellationToken cancellationToken)
    {
        return await context.GetAsync(request, cancellationToken).RemoveReferenceCycles();
    }
}

[Handler]
public class ListHandler<TEntity>(ContextService context) : IQueryHandler<ListRequest<TEntity>, List<TEntity>> where TEntity : class
{
    public async Task<List<TEntity>> Handle(ListRequest<TEntity> request, CancellationToken cancellationToken)
    {
        return await context.ListAsync(request, cancellationToken).RemoveCyclesAsync(cancellationToken);
    }
}

[Handler]
public class CountHandler<TEntity>(ContextService context) : IQueryHandler<CountRequest<TEntity>, long> where TEntity : class
{
    public async Task<long> Handle(CountRequest<TEntity> request, CancellationToken cancellationToken)
    {
        return await context.CountAsync(request, cancellationToken);
    }
}

[Handler]
public class CreateHandler<TEntityCreate, TEntity>(ContextService context, DomainHandlerProvider domainHandler) : ICommandHandler<CreateCommand<TEntityCreate, TEntity>, TEntity> where TEntity : class where TEntityCreate : class, IDto<TEntity>
{
    public async Task<TEntity> Handle(CreateCommand<TEntityCreate, TEntity> request, CancellationToken cancellationToken)
    {
        var entity = request.Entity.Create();
        await domainHandler.CheckCreateAsync(entity, cancellationToken);

        return (await context.CreateAsync(entity, cancellationToken)).RemoveReferenceCycles();
    }
}

[Handler]
public class UpdateHandler<TEntityUpdate, TEntity>(ContextService context, DomainHandlerProvider domainHandler) : ICommandHandler<UpdateCommand<int, TEntityUpdate, TEntity>, TEntity> where TEntity : class where TEntityUpdate : class, IDto<TEntity>
{
    public async Task<TEntity> Handle(UpdateCommand<int, TEntityUpdate, TEntity> request, CancellationToken cancellationToken)
    {
        var entity = request.Entity is IVersioned e
            ? await domainHandler.ResolveUpdate(context.Set<TEntity>(), request.Key, e.Version, cancellationToken)
            : await domainHandler.ResolveUpdate(context.Set<TEntity>(), request.Key, cancellationToken);

        request.Entity.Copy(entity);
        await domainHandler.CheckUpdateAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return entity.RemoveReferenceCycles();
    }
}

[Handler]
public class DeleteHandler<TEntity>(ContextService context, DomainHandlerProvider domainHandler) : ICommandHandler<DeleteCommand<int, TEntity>> where TEntity : class
{
    public async Task Handle(DeleteCommand<int, TEntity> request, CancellationToken cancellationToken)
    {
        var entity = await domainHandler.ResolveDelete(context.Set<TEntity>(), request.Key, cancellationToken);

        context.Set<TEntity>().Remove(entity);

        await context.SaveChangesAsync(cancellationToken);
    }
}
