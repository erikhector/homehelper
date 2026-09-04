using Dekiru.ApiUtils.ErrorHandling;
using Dekiru.ApiUtils.Extensions;
using Dekiru.ApiUtils.Spa;
using Dekiru.ApiUtils.Domain;
using Dekiru.Hermes;
using HomeHelper.Data;
using HomeHelper.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using TypeScriptClientBuilder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().ConfigureJson();
builder.Services.AddOpenApi();
builder.Services.AddDefaultProblemDetailsProducer();
builder.Services.AddScoped<DomainHandlerProvider>();
builder.Services.AddHermes();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
    });
builder.Services.AddScoped<ContextService>();
builder.Services.AddDbContext<HomehelperContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database")));

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
    // Render terminates TLS at its edge proxy and forwards plain HTTP; without trusting
    // X-Forwarded-Proto here, UseHttpsRedirection below would redirect-loop.
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
        KnownIPNetworks = { },
        KnownProxies = { }
    });
    app.UseHttpsRedirection();
    app.UseWhen(context =>
        HttpMethods.IsGet(context.Request.Method),
        builder =>
            builder.UseSpaWithTransforms("wwwroot", (_, values) => { }));
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<HomehelperContext>();
    await context.Database.MigrateAsync();
}

app.UseGlobalExceptionHandler(app.Environment.IsDevelopment());

app.UseAuthentication();
app.UseAuthorization();

// Uncomment to activate authorization for all controllers
app.MapControllers();

await app.RunAsync();
