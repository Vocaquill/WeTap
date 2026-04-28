using Application.Models.User;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces;

public interface IUserService
{
    Task LoadLoginsAndRolesAsync(List<UserItemModel> users);
}
