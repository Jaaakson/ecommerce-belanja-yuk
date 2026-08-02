using BelanjaYuk.Domain.Entities;

namespace BelanjaYuk.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAt) Generate(MsUser user);
}
