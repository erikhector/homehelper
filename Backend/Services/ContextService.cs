using Dekiru.ApiUtils.Extensions;
using Dekiru.ApiUtils.Services;
using Dekiru.QueryFilter.Extensions;
using HomeHelper.Data;

namespace HomeHelper.Services;

public class ContextService(HomehelperContext context) : ContextServiceBase<HomehelperContext>(context)
{
    public override IQueryable<T> ApplyFiltering<T>(IQueryable<T> query, string? filter)
    {
        return query.FilterDynamic(filter);
    }

    public override IQueryable<T> ApplyIncludes<T>(IQueryable<T> query, List<string>? includes)
    {
        return query.IncludeDynamic(includes?.ToArray());
    }

    public override IQueryable<T> ApplyPagination<T>(IQueryable<T> query, int? skip, int? take)
    {
        return query.WhenNotNull(skip, (q, s) => q.Skip(s))
                    .WhenNotNull(take, (q, t) => q.Take(t));
    }

    public override IQueryable<T> ApplySorting<T>(IQueryable<T> query, string? sort)
    {
        return query.SortDynamic(sort);
    }
}
