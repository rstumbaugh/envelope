using Envelope.Budget.Service.Auth;
using Envelope.Budget.Service.Hubs;
using Envelope.Core.Repositories;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Newtonsoft.Json.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Envelope.Budget.Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var corsOptions = "_openCors";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(corsOptions, policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            builder.Services.AddSignalR()
                .AddJsonProtocol(options =>
                {
                    options.PayloadSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                    options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            builder.Services
                .AddAuthorization()
                .AddAuthentication(GoogleAuthenticationHandlerOptions.Scheme)
                .AddScheme<GoogleAuthenticationHandlerOptions, GoogleAuthenticationHandler>(
                    GoogleAuthenticationHandlerOptions.Scheme, 
                    options =>
                    {

                    });

            // Add services to the container.
            builder.Services.AddRouting(options =>
            {
                options.LowercaseUrls = true;
            });

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSingleton<IUserProvider, NullUserProvider>();
            builder.Services.AddSingleton<IBudgetRepository, NullBudgetRepository>();
            builder.Services.AddSingleton<ITransactionRepository, NullTransactionRepository>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(corsOptions);

            app.UseMiddleware<WebSocketAuthMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHub<BudgetHub>("/hubBudget");
            app.MapHub<TransactionHub>("/hubTransaction");

            app.MapControllers();

            app.Run();
        }
    }
}