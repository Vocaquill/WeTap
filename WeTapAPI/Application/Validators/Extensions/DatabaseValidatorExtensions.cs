using Domain;
using Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Extensions;

public static class DatabaseValidatorExtensions
{
    /// <summary>
    /// Перевіряє чи існує запис в базі даних за його Id.
    /// </summary>
    public static IRuleBuilderOptions<T, TKey> MustExistAsync<T, TEntity, TKey>(
        this IRuleBuilder<T, TKey> ruleBuilder,
        AppDbContext db,
        string errorMessage = "Запис не знайдено")
        where TEntity : class, IEntity<TKey>
        where TKey : IEquatable<TKey>
    {
        return ruleBuilder.MustAsync(async (id, cancellation) =>
            await db.Set<TEntity>().AnyAsync(e => e.Id.Equals(id) && !e.IsDeleted, cancellation))
            .WithMessage(errorMessage);
    }

    /// <summary>
    /// Перевіряє чи існує запис в базі даних за його Id (для nullable Id).
    /// </summary>
    public static IRuleBuilderOptions<T, TKey?> MustExistAsync<T, TEntity, TKey>(
        this IRuleBuilder<T, TKey?> ruleBuilder,
        AppDbContext db,
        string errorMessage = "Запис не знайдено")
        where TEntity : class, IEntity<TKey>
        where TKey : struct, IEquatable<TKey>
    {
        return ruleBuilder.MustAsync(async (id, cancellation) =>
        {
            if (!id.HasValue) return true;
            return await db.Set<TEntity>().AnyAsync(e => e.Id.Equals(id.Value) && !e.IsDeleted, cancellation);
        })
        .WithMessage(errorMessage);
    }

    /// <summary>
    /// Перевіряє чи існують всі записи в базі даних за списком Id.
    /// </summary>
    public static IRuleBuilderOptions<T, TKey[]> MustExistAsync<T, TEntity, TKey>(
        this IRuleBuilder<T, TKey[]> ruleBuilder,
        AppDbContext db,
        string errorMessage = "Один або кілька записів не знайдено")
        where TEntity : class, IEntity<TKey>
        where TKey : IEquatable<TKey>
    {
        return ruleBuilder.MustAsync(async (ids, cancellation) =>
        {
            if (ids == null || ids.Length == 0) return true;
            var distinctIds = ids.Distinct().ToArray();
            var count = await db.Set<TEntity>()
                .CountAsync(e => distinctIds.Contains(e.Id) && !e.IsDeleted, cancellation);
            return count == distinctIds.Length;
        })
        .WithMessage(errorMessage);
    }

    /// <summary>
    /// Перевіряє чи є слаг унікальним для сутності.
    /// </summary>
    public static IRuleBuilderOptions<T, string> UniqueSlugAsync<T, TEntity, TKey>(
        this IRuleBuilder<T, string> ruleBuilder,
        AppDbContext db,
        string errorMessage = "Запис з таким слагом вже існує")
        where TEntity : class, IEntity<TKey>
    {
        return ruleBuilder.MustAsync(async (slug, cancellation) =>
        {
            if (string.IsNullOrWhiteSpace(slug)) return true;
            var normalized = slug.Trim().ToLower().Replace(" ", "-");
            return !await db.Set<TEntity>().AnyAsync(e => 
                EF.Property<string>(e, "Slug") == normalized && !e.IsDeleted, cancellation);
        })
        .WithMessage(errorMessage);
    }

    /// <summary>
    /// Перевіряє чи є слаг унікальним для сутності при оновленні (ігноруючи поточний Id).
    /// </summary>
    public static IRuleBuilderOptions<T, string> UniqueSlugUpdateAsync<T, TEntity, TKey>(
        this IRuleBuilder<T, string> ruleBuilder,
        AppDbContext db,
        Func<T, TKey> idSelector,
        string errorMessage = "Інший запис з таким слагом вже існує")
        where TEntity : class, IEntity<TKey>
        where TKey : IEquatable<TKey>
    {
        return ruleBuilder.MustAsync(async (model, slug, cancellation) =>
        {
            if (string.IsNullOrWhiteSpace(slug)) return true;
            var id = idSelector(model);
            var normalized = slug.Trim().ToLower().Replace(" ", "-");
            return !await db.Set<TEntity>().AnyAsync(e => 
                EF.Property<string>(e, "Slug") == normalized && 
                !e.Id.Equals(id) && 
                !e.IsDeleted, cancellation);
        })
        .WithMessage(errorMessage);
    }

    /// <summary>
    /// Перевіряє чи є значення певної властивості унікальним.
    /// </summary>
    public static IRuleBuilderOptions<T, string> UniquePropertyAsync<T, TEntity, TKey>(
        this IRuleBuilder<T, string> ruleBuilder,
        AppDbContext db,
        string propertyName,
        string errorMessage)
        where TEntity : class, IEntity<TKey>
    {
        return ruleBuilder.MustAsync(async (value, cancellation) =>
        {
            if (string.IsNullOrWhiteSpace(value)) return true;
            return !await db.Set<TEntity>().AnyAsync(e => 
                EF.Property<string>(e, propertyName) == value && !e.IsDeleted, cancellation);
        })
        .WithMessage(errorMessage);
    }

    /// <summary>
    /// Перевіряє чи є значення певної властивості унікальним при оновленні (ігноруючи поточний Id).
    /// </summary>
    public static IRuleBuilderOptions<T, string> UniquePropertyUpdateAsync<T, TEntity, TKey>(
        this IRuleBuilder<T, string> ruleBuilder,
        AppDbContext db,
        string propertyName,
        Func<T, TKey> idSelector,
        string errorMessage)
        where TEntity : class, IEntity<TKey>
        where TKey : IEquatable<TKey>
    {
        return ruleBuilder.MustAsync(async (model, value, cancellation) =>
        {
            if (string.IsNullOrWhiteSpace(value)) return true;
            var id = idSelector(model);
            return !await db.Set<TEntity>().AnyAsync(e => 
                EF.Property<string>(e, propertyName) == value && 
                !e.Id.Equals(id) && 
                !e.IsDeleted, cancellation);
        })
        .WithMessage(errorMessage);
    }
}
