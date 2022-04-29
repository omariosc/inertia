using System.Linq.Expressions;
using System.Reflection;
using inertia.Models;
using Microsoft.EntityFrameworkCore.Metadata;

namespace inertia.Util;


/// <summary>
/// Global Query filter that ignores soft deleted entities from queries.
/// </summary>
public static class SoftDeleteQueryExtension
{
    public static void AddSoftDeleteQueryFilter(this IMutableEntityType entityType)
    {
        var methodToCall = typeof(SoftDeleteQueryExtension)
            .GetMethod(nameof(GetSoftDeleteFilter), BindingFlags.NonPublic | BindingFlags.Static)!
            .MakeGenericMethod(entityType.ClrType);
        var filter = methodToCall.Invoke(null, new object[] { });
        entityType.SetQueryFilter((LambdaExpression)filter!);
        entityType.AddIndex(entityType.FindProperty(nameof(ISoftDelete.SoftDeleted))!);
    }
    
    private static LambdaExpression GetSoftDeleteFilter<TEntity>()
        where TEntity : class, ISoftDelete
    {
        Expression<Func<TEntity, bool>> filter = x => !x.SoftDeleted;
        return filter;
    }
}