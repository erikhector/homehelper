using Dekiru.Hermes.Abstractions;
using Dekiru.Hermes.Abstractions.Interfaces;
using HomeHelper.Data;
using HomeHelper.DTO;

namespace HomeHelper.Handler;

[Handler]
public class PlaceholderCreateHandler : ICommandHandler<PlaceholderCreate, Placeholder>
{
    public Task<Placeholder> Handle(PlaceholderCreate request, CancellationToken cancellationToken)
    {
        var placeholder = request.Create();
        placeholder.PlaceholderId = new Random().Next(1, 1000); // Simulate database-generated ID
        return Task.FromResult(placeholder);
    }
}
