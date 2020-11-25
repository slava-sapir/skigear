using System;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IResponseCashService
    {
        Task CashResponseAsync(string cashKey, object esponse, TimeSpan timeToLive);
        Task<string> GetCashResponseAsync(string cashKey);
    }
}