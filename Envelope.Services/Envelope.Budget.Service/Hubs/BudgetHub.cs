using Envelope.Budget.Service.Auth;
using Envelope.Core.Models;
using Envelope.Core.Repositories;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Envelope.Budget.Service.Hubs
{
    public interface IBudgetHubClient
    {
        Task OnAuthenticated(UserAuthResult result);
        Task OnBudget(Core.Models.Budget budget);
    }

    public class BudgetHub : Hub<IBudgetHubClient>
    {
        private readonly ILogger<BudgetHub> _logger;
        private readonly IBudgetRepository _budgetRepository;

        // todo: auth

        public BudgetHub(
            ILogger<BudgetHub> logger,
            IBudgetRepository budgetRepository)
        {
            _logger = logger;
            _budgetRepository = budgetRepository;
        }

        public async Task RequestBudget(string budgetId)
        {
            _logger.LogInformation("Getting budget {id}", budgetId);
            var budget = await _budgetRepository.GetAsync(budgetId);
            await Clients.Caller.OnBudget(budget);
        }
    }
}
