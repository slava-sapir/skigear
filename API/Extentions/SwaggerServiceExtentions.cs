using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace API.Extentions
{
    public static class SwaggerServiceExtentions
    {
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
             services.AddSwaggerGen(c => 
            {
                c.SwaggerDoc("v1", new OpenApiInfo{ Title = "SkiGear API", Version = "v1"});
                var securityScheme = new OpenApiSecurityScheme
                {
                    Description = "JWT Auth Bearer Sheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };
                c.AddSecurityDefinition("Bearer", securityScheme);
                var securityRequirements = new OpenApiSecurityRequirement{{ securityScheme, new[]
                {"Bearer"}}};
                c.AddSecurityRequirement(securityRequirements);
            });

            return services;
        }

        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI( c => {c.SwaggerEndpoint("/swagger/v1/swagger.json", "SkiGear API V1");});

            return app;
        }
    }
}