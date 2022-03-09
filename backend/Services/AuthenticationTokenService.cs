using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;


using inertia.Models;

namespace inertia.Services;

public class AuthenticationTokenService
{
    private readonly string _jwtKey;
    private readonly string _jwtIssuer;
    private readonly int _jwtAccessTokenExpiryInDays;

    public AuthenticationTokenService(IConfiguration configuration)
    {
        _jwtKey = configuration["Jwt:Key"];
        _jwtIssuer = configuration["Jwt:Issuer"];
        _jwtAccessTokenExpiryInDays = int.Parse(configuration["Jwt:AccessTokenExpiryInDays"]);
    }
    
    public string? GenerateAccessToken(Account account)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.PrimarySid, account.AccountId),
            new Claim(ClaimTypes.Name, account.Name),
            new Claim(ClaimTypes.Email, account.Email),
            new Claim(ClaimTypes.Role, account.Role.ToString())
        };

        var issuedAt = DateTime.UtcNow;
        var expiresAt = issuedAt.AddDays(_jwtAccessTokenExpiryInDays);

        return generateToken(claims, issuedAt, expiresAt);
    }

    private string? generateToken(IEnumerable<Claim> claims, DateTime issuedAt, DateTime expiresAt)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var tokenDescriptor = new JwtSecurityToken(
            new JwtHeader(signingCredentials: credentials),
            new JwtPayload(issuer: _jwtIssuer, audience: _jwtIssuer, claims: claims, notBefore: null, expires: expiresAt, issuedAt: issuedAt)
        );
        
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);  
    }

    public ClaimsPrincipal? ValidateAccessToken(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            return tokenHandler.ValidateToken(
                token, 
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = _jwtIssuer,
                    ValidAudience = _jwtIssuer,
                    IssuerSigningKey = key
                },
                out _
            );
        }
        catch
        {
            return null;
        }
    }
}