using Dekiru.DtoGenerator.Abstractions;
using HomeHelper.Data;

namespace HomeHelper.DTO;

[DtoFor<Placeholder>]
[OmitKeysByConvention]
public partial class PlaceholderCreate;
