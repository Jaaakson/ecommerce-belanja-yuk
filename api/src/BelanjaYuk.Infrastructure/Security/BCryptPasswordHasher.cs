using BelanjaYuk.Application.Common.Interfaces;

namespace BelanjaYuk.Infrastructure.Security;

public class BCryptPasswordHasher : IPasswordHasher
{
    /// <summary>
    /// Each increment doubles the hashing cost. 12 keeps verification around
    /// 250ms on typical hardware — slow enough to deter brute force, fast
    /// enough for an interactive login.
    /// </summary>
    private const int WorkFactor = 12;

    public string Hash(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public bool Verify(string password, string hash) =>
        BCrypt.Net.BCrypt.Verify(password, hash);
}
