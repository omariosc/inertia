using System.Security.Cryptography;
using EntityFramework.Exceptions.Common;
using inertia.Enums;
using inertia.Models;
using Isopoh.Cryptography.Argon2;
using Microsoft.EntityFrameworkCore;

namespace inertia.Services;

public class UsersService
{
    private static readonly RandomNumberGenerator RandomEngine = RandomNumberGenerator.Create();
    private readonly InertiaContext _db;

    public UsersService(InertiaContext db)
    {
        _db = db;
    }

    public async Task<Account?> CreateAccount(
        string email,
        string password,
        string name,
        UserType userType
        )
    {
        try
        {
            string salt = GenerateSalt();

            var account = new Account
            {
                AccountId = await Nanoid.Nanoid.GenerateAsync(),
                Name = name,
                Email = email,
                Password = Argon2.Hash(salt + password),
                Salt = salt,
                Role = AccountRole.User,
                State = AccountState.PendingApproval,
                UserType = userType
            };

            await _db.Accounts.AddAsync(account);
            await _db.SaveChangesAsync();

            return account;
        }
        catch (UniqueConstraintException)
        {
            return null;
        }
    }

    public async Task<Account?> CreateEmployeeAccount(
        string email,
        string password,
        string name
    )
    {
        try
        {
            string salt = GenerateSalt();

            var account = new Account
            {
                AccountId = await Nanoid.Nanoid.GenerateAsync(),
                Name = name,
                Email = email,
                Password = Argon2.Hash(salt + password),
                Salt = salt,
                Role = AccountRole.Employee,
                State = AccountState.PendingApproval,
                UserType = UserType.Regular,
            };

            await _db.Accounts.AddAsync(account);
            await _db.SaveChangesAsync();

            return account;
        }
        catch (UniqueConstraintException)
        {
            return null;
        }
    }
    
    public async Task<Account?> MatchAccount(string email, string password)
    {
        var account = await _db.Accounts.Where(a => a.Email == email).FirstOrDefaultAsync();

        if (account == null)
            return null;
        
        if (Argon2.Verify(encoded: account.Password, password: account.Salt + password))
            return account;

        return null;
    }

    private static string GenerateSalt()
    {
        int saltLength = 32;
        var salt = new byte[saltLength];
        RandomEngine.GetBytes(salt);

        return Convert.ToBase64String(salt);
    }
}