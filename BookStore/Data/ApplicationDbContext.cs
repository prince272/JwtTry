using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using BookStore.Entities;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace BookStore.DBContext
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, string,
        IdentityUserClaim<string>, UserRole, IdentityUserLogin<string>,
        IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }

        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>().HasMany(_ => _.UserRoles).WithOne(_ => _.User).HasForeignKey(_ => _.UserId).IsRequired();
            builder.Entity<Role>().HasMany(_ => _.UserRoles).WithOne(_ => _.Role).HasForeignKey(_ => _.RoleId).IsRequired();

            // Entity Framework Core - setting the decimal precision and scale to all decimal properties [duplicate]
            // source: https://stackoverflow.com/questions/43277154/entity-framework-core-setting-the-decimal-precision-and-scale-to-all-decimal-p
            builder.Model.GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?))
                .ToList().ForEach(property =>
                {
                    // EF Core 1 & 2
                    //property.Relational().ColumnType = "decimal(18, 6)";

                    // EF Core 3
                    //property.SetColumnType("decimal(18, 6)");

                    // EF Core 5
                    property.SetPrecision(18);
                    property.SetScale(6);
                });



            builder.Entity<User>().HasData(new User
            {
                Id = "ac409a60-a983-472a-8285-6a1ab76aa8ec",
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                Email = "admin@example.com",
                NormalizedEmail = "ADMIN@EXAMPLE.COM",
                EmailConfirmed = true,
                PasswordHash = "AQAAAAEAACcQAAAAENol68acQwWc6kK1IPj71iJ6VsDIeNirW0eQpA6bN4fML6I2jKy2O5eelHf2oduJpw==",
                SecurityStamp = "MW3RQKW2MYCRQDGQ4O6DNLRXFJST3C4V",
                ConcurrencyStamp = "68a80f2a-46f5-4e34-bfa4-1d3050a9b447",
            });

            builder.Entity<Role>().HasData(new Role
            {
                Id = "21d20c24-3fe2-4447-9828-f0fde6b51e4a",
                Name = "Admin",
                NormalizedName = "ADMIN",
                ConcurrencyStamp = "2a657545-4b52-49e1-8fc1-28c31630df63"
            });

            builder.Entity<UserRole>().HasData(new UserRole
            {
                UserId = "ac409a60-a983-472a-8285-6a1ab76aa8ec",
                RoleId = "21d20c24-3fe2-4447-9828-f0fde6b51e4a",
            });
        }
    }
}