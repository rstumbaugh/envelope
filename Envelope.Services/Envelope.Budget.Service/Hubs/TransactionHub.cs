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

    }
}
