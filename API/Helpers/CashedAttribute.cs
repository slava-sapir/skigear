using System.Net.Mime;
using System.Text;
using System;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace API.Helpers
{
    public class CashedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _timeToLiveSeconds;
        public CashedAttribute(int timeToLiveSeconds)
        {
            _timeToLiveSeconds = timeToLiveSeconds;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context,
         ActionExecutionDelegate next)
        {
            var cashService = 
            context.HttpContext.RequestServices.GetRequiredService<IResponseCashService>();
            var cashKey = GenerateCashKeyFromRequest(context.HttpContext.Request);
            var cashedResponse = await cashService.GetCashResponseAsync(cashKey);
            if (!string.IsNullOrEmpty(cashedResponse))
            {
                var contentResult = new ContentResult
                {
                    Content = cashedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };
                context.Result = contentResult;
                return;
            }

            var executedContext = await next();//move to the controller

            if (executedContext.Result is OkObjectResult okObjectResult)
            {
                await cashService.CashResponseAsync(cashKey, okObjectResult.Value,
                TimeSpan.FromSeconds(_timeToLiveSeconds));
            }

        }

        private string GenerateCashKeyFromRequest(HttpRequest request)
        {
            var keyBuilder = new StringBuilder();
            keyBuilder.Append($"{request.Path}");
            foreach(var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                keyBuilder.Append($"|{key}-{value}");
            }
            return keyBuilder.ToString();
        }
    }
}