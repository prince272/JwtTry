using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace BookStore.Entities
{
    public class User : IdentityUser
    {
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}