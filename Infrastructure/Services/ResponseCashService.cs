using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services
{
    public class ResponseCashService : IResponseCashService
    {
        private readonly IDatabase _database;
        public ResponseCashService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task CashResponseAsync(string cashKey, object response, TimeSpan timeToLive)
        {
            if (response == null)
            {
               return;
            }
            
            var options = new JsonSerializerOptions
            {
               PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var serializedResponse = JsonSerializer.Serialize(response, options);
            await _database.StringSetAsync(cashKey, serializedResponse, timeToLive);
        }

        public async Task<string> GetCashResponseAsync(string cashKey)
        {
           var cashedResponse = await _database.StringGetAsync(cashKey);

           if (cashedResponse.IsNullOrEmpty)
            {
                return null;
            }
           
           return cashedResponse;
        }
    }
}