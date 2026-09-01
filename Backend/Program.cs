using Dekiru.ApiUtils.ErrorHandling;
using Dekiru.ApiUtils.Extensions;
using Dekiru.ApiUtils.Spa;
using Dekiru.Hermes;
using HomeHelper.Data;
using HomeHelper.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using TypeScriptClientBuilder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().ConfigureJson();
builder.Services.AddOpenApi();
builder.Services.AddDefaultProblemDetailsProducer();
builder.Services.AddHermes();
builder.Services.AddScoped<ContextService>();
builder.Services.AddDbContext<HomehelperContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Database")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(opts =>
    {
        opts.WithTitle($"{app.Environment.ApplicationName} API");
    });

    ClientBuilder.Build(new ClientConfiguration
    {
        Output = "../Frontend/src/api",
        CleanOutput = true,
        UseInheritance = true,
        UseChecksum = false
    });
}
else
{
    app.UseHttpsRedirection();
    app.UseWhen(context =>
        HttpMethods.IsGet(context.Request.Method),
        builder =>
            builder.UseSpaWithTransforms("wwwroot", (_, values) => { }));
}

// Remove the preprocessor directive below to enable database migrations on application startup
#if false
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<PlaceholderContext>();
    await context.Database.MigrateAsync();
}
#endif

app.UseGlobalExceptionHandler(app.Environment.IsDevelopment());

app.UseAuthorization();

// Uncomment to activate authorization for all controllers
app.MapControllers()/*.RequireAuthorization()*/;

await app.RunAsync();
