using System.Security.Claims;

namespace Dependencies;

public class UserContext(IHttpContextAccessor http)
{
    readonly string? userId = http.HttpContext?.User.FindFirst("userId")?.Value ?? null;
    readonly List<Claim>? roles = http.HttpContext?.User.FindAll(ClaimTypes.Role).ToList() ?? null;
    readonly string? isDemo = http.HttpContext?.User.FindFirst("isDemo")?.Value ?? null;

    public int? GetUserId()
    {
        if (userId == null) return null;
        return int.Parse(userId);
    }

    public List<Claim> GetRoles()
    {
        if (roles == null) return [];
        return roles;
    }

    public bool GetIsDemo()
    {
        return isDemo == "true";
    }
}