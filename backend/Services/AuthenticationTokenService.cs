using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;


using inertia.Models;

namespace inertia.Services;

/// <summary>
/// Generates Authentication tokens, to safely and securely
/// authenticate and authorize users.
/// </summary>
public class AuthenticationTokenService
{
    /// <summary>
    /// from configuration, the key used to generated the tokens
    /// </summary>
    private readonly string _jwtKey;
    
    /// <summary>
    /// from configuration, the name of the issuer
    /// </summary>
    private readonly string _jwtIssuer;
    
    /// <summary>
    /// from configuration, the number of days the generated token is valid
    /// </summary>
    private readonly int _jwtAccessTokenExpiryInDays;
    
    public AuthenticationTokenService(IConfiguration configuration)
    {
        _jwtKey = configuration["Jwt:Key"];
        _jwtIssuer = configuration["Jwt:Issuer"];
        _jwtAccessTokenExpiryInDays = int.Parse(configuration["Jwt:AccessTokenExpiryInDays"]);
    }
    
    /// <summary>
    /// Generates an access token for an account
    /// </summary>
    /// <param name="account"></param>
    /// <returns></returns>
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

    /// <summary>
    /// Checks whether a token is valid. 
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
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