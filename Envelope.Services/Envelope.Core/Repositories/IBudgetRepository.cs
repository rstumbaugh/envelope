using Envelope.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Envelope.Core.Repositories
{
    public interface IBudgetRepository
    {
        Task<Budget[]> GetAsync();
        Task<Budget> GetAsync(string id);
    }

    public class NullBudgetRepository : IBudgetRepository
    {
        private Budget[] _budgets = new[]
        {
            new Budget
            {
                Id = "7cea64d2-2c82-46ef-8ff2-db0017c1a9c6",
                Name = "My Budget",
                Accounts = new Account[]
                {
                   new Account()
                   {
                       Id = "fa22591c-c8bc-4543-b139-ba20faed8851",
                       Name = "Savings",
                       ClearedBalance = 25000,
                       Type = AccountType.CashAccount
                   },
                   new Account
                   {
                       Id = "6cb16903-2d4b-408b-bb54-6ac921a23477",
                       Name = "Checking",
                       ClearedBalance = 100,
                       Type = AccountType.CashAccount
                   },
                   new Account
                   {
                       Id = "6ed5000a-e0b1-407c-ad8f-7c3c24582ef1",
                       Name = "Investment",
                       Type = AccountType.Tracking,
                       ClearedBalance = 50000
                   },
                   new Account
                   {
                       Id = "f1ac41a2-c34f-4316-b337-9038311ae65e",
                       Name = "Car loan",
                       Type = AccountType.Loan,
                       ClearedBalance = -5000
                   }
                },
                CategoryGroups = new []
                {
                    new CategoryGroup
                    {
                        Id = "fixed",
                        Name = "Fixed"
                    },
                    new CategoryGroup
                    {
                        Id = "variable",
                        Name = "Variable"
                    }
                },
                Categories = new []
                {
                    new Category
                    {
                        Id = "category1",
                        Name = "Rent",
                        GroupId = "fixed"
                    },
                    new Category
                    {
                        Id = "category2",
                        Name = "Utilities",
                        GroupId = "fixed"
                    },
                    new Category
                    {
                        Id = "category1",
                        Name = "Food",
                        GroupId = "variable"
                    },
                    new Category
                    {
                        Id = "category4",
                        Name = "Drinks",
                        GroupId = "variable"
                    },
                    new Category
                    {
                        Id = "category5",
                        Name = "Shopping",
                        GroupId = "variable"
                    },
                },
                MonthlyAssigned = new Dictionary<string, MonthlyAssigned>
                {
                    ["202310"] = new MonthlyAssigned
                    {
                        CategoryAssigned = new Dictionary<string, double>
                        {
                            ["category1"] = 100,
                            ["category2"] = 534,
                            ["category3"] = 342.12,
                            ["category4"] = 890.56,
                        }
                    }
                }
            }
        };

        public Task<Budget[]> GetAsync()
        {
            return Task.FromResult(_budgets);
        }

        public Task<Budget> GetAsync(string id)
        {
            return Task.FromResult(_budgets.First(b => b.Id == id));
        }
    }
}
