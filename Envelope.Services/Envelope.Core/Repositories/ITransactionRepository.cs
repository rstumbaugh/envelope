using Envelope.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Envelope.Core.Repositories
{
    public class TransactionSearchRequest
    {
        public string AccountId { get; set; }
    }

    public interface ITransactionRepository
    {
        Task<Core.Models.Transaction[]> GetAsync(TransactionSearchRequest searchRequest);
        Task<Transaction> UpdateAsync(Transaction newTransaction);
    }

    public class NullTransactionRepository : ITransactionRepository
    {
        private readonly List<Transaction> _transactions = new List<Transaction>();

        public async Task<Transaction[]> GetAsync(TransactionSearchRequest searchRequest)
        {
            await InitTransactions();
            return _transactions
                .Where(_ => string.IsNullOrEmpty(searchRequest.AccountId) || _.AccountId == searchRequest.AccountId)
                .ToArray();
        }

        private async Task InitTransactions()
        {
            if (_transactions.Any()) return;

            var budget = await new NullBudgetRepository().GetAsync("7cea64d2-2c82-46ef-8ff2-db0017c1a9c6");

            var random = new Random();
            var payees = new[]
            {
                "Coffee shop", "Clothes store", "Nike", "Amazon", "Bar", "Restaurant"
            };

            foreach (var acct in budget.Accounts
                .Where(_ => _.Type == AccountType.CashAccount || _.Type == AccountType.CreditCard))
            {
                foreach (var _ in Enumerable.Range(0, 50))
                {
                    var date = DateTime.Now.AddDays(-1 * random.Next(60));
                    var amount = random.Next(500);
                    var isBuy = random.NextDouble() < 0.75;
                    var payee = payees[random.Next(payees.Length)];


                    _transactions.Add(
                        new Transaction
                        {
                            Id = Guid.NewGuid().ToString(),
                            AccountId = acct.Id,
                            Timestamp = date,
                            Amount = amount * (isBuy ? 1 : -1),
                            Payee = payee,
                            IsCleared = true
                        });
                }
            }
        }

        public Task<Transaction> UpdateAsync(Transaction newTransaction)
        {
            var i = _transactions.FindIndex(_ => _.Id == newTransaction.Id);
            if (i >= 0)
            {
                _transactions[i] = newTransaction;
                return Task.FromResult(newTransaction);
            }

            throw new Exception($"Transaction not found: {newTransaction}");
        }
    }
}
