using Envelope.Budget.Service.Auth;
using Envelope.Core.Models;
using Envelope.Core.Repositories;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Envelope.Budget.Service.Hubs
{
    public interface ITransactionHubClient
    {
        Task OnTransactions(Transaction[] transactions);
        Task OnDeleted(Transaction t);
    }

    public class TransactionHub : Hub<ITransactionHubClient>
    {
        private readonly ILogger<TransactionHub> _logger;
        private readonly ITransactionRepository _transactionRepository;

        // todo: auth

        public TransactionHub(
            ILogger<TransactionHub> logger,
            ITransactionRepository transactionRepository)
        {
            _logger = logger;
            _transactionRepository = transactionRepository;
        }

        public async Task RequestTransactions(TransactionSearchRequest request)
        {
            var transactions = await _transactionRepository.GetAsync(request);
            await Clients.Caller.OnTransactions(transactions);
        }

        public async Task UpdateTransaction(Transaction newTransaction)
        {
            var updated = await _transactionRepository.UpdateAsync(newTransaction);
            await Clients.All.OnTransactions(new[] { updated });
        }

        public async Task AddTransaction(Transaction newTransaction)
        {
            var t = await _transactionRepository.AddAsync(newTransaction);
            await Clients.All.OnTransactions(new[] { t });
        }

        public async Task DeleteTransaction(Transaction t)
        {
            await _transactionRepository.DeleteAsync(t);
            await Clients.All.OnDeleted(t);

        }
    }
}
