using System.Security.Claims;
using HomeHelper.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace HomeHelper.Controllers;

public record RegisterRequest(string DisplayName, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthenticatedUserResponse(int UserId, string DisplayName, string Email);
public record UpdateDisplayNameRequest(string DisplayName);

[Route("api/auth")]
[ApiController]
public class AuthController(HomehelperContext context, IPasswordHasher<User> passwordHasher, IMemoryCache cache) : ControllerBase
{
    private const int MaximumFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);

    [HttpPost("register")]
    public async Task<ActionResult<AuthenticatedUserResponse>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var displayName = request.DisplayName.Trim();
        var email = request.Email.Trim();
        var normalizedEmail = email.ToUpperInvariant();
        if (string.IsNullOrWhiteSpace(displayName) || string.IsNullOrWhiteSpace(email) || request.Password.Length < 8)
            return BadRequest(new { detail = "Enter a name, valid email, and password with at least 8 characters." });

        if (await context.Users.AnyAsync(user => user.NormalizedEmail == normalizedEmail, cancellationToken))
            return Conflict(new { detail = "An account with this email already exists." });

        var user = new User { DisplayName = displayName, Email = email, NormalizedEmail = normalizedEmail, CreatedAt = DateTimeOffset.UtcNow };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        context.Users.Add(user);
        await context.SaveChangesAsync(cancellationToken);
        await SignIn(user);
        return Ok(ToResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthenticatedUserResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var cacheKey = $"auth-failures:{normalizedEmail}";
        if (cache.TryGetValue<int>(cacheKey, out var failures) && failures >= MaximumFailedAttempts)
            return StatusCode(StatusCodes.Status429TooManyRequests, new { detail = "Too many unsuccessful attempts. Try again later." });

        var user = await context.Users.SingleOrDefaultAsync(candidate => candidate.NormalizedEmail == normalizedEmail, cancellationToken);
        if (user is null || passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
        {
            cache.Set(cacheKey, failures + 1, LockoutDuration);
            return Unauthorized(new { detail = "Email or password is incorrect." });
        }

        cache.Remove(cacheKey);
        user.LastLoginAt = DateTimeOffset.UtcNow;
        await context.SaveChangesAsync(cancellationToken);
        await SignIn(user);
        return Ok(ToResponse(user));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<AuthenticatedUserResponse>> GetCurrentUser(CancellationToken cancellationToken)
    {
        var user = await FindCurrentUser(cancellationToken);
        return user is null ? Unauthorized() : Ok(ToResponse(user));
    }

    [Authorize]
    [HttpPut("me/display-name")]
    public async Task<ActionResult<AuthenticatedUserResponse>> UpdateDisplayName(UpdateDisplayNameRequest request, CancellationToken cancellationToken)
    {
        var displayName = request.DisplayName.Trim();
        if (string.IsNullOrWhiteSpace(displayName)) return BadRequest(new { detail = "Enter a display name." });

        var user = await FindCurrentUser(cancellationToken);
        if (user is null) return Unauthorized();

        user.DisplayName = displayName;
        await context.SaveChangesAsync(cancellationToken);
        return Ok(ToResponse(user));
    }

    private async Task SignIn(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.DisplayName),
            new Claim(ClaimTypes.Email, user.Email)
        };
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));
    }

    private Task<User?> FindCurrentUser(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out var userId)
            ? context.Users.SingleOrDefaultAsync(user => user.UserId == userId, cancellationToken)
            : Task.FromResult<User?>(null);
    }

    private static AuthenticatedUserResponse ToResponse(User user) => new(user.UserId, user.DisplayName, user.Email);
}