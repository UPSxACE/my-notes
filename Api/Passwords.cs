using BCrypt.Net;


namespace Passwords;

static class Password
{
    public static string Hash(string password)
    {
        string salt = BCrypt.Net.BCrypt.GenerateSalt();
        string hash = BCrypt.Net.BCrypt.HashPassword(password, salt);

        return hash;
    }

    public static bool Verify(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}