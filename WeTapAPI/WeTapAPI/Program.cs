using Infrastructure;
using Infrastructure.Middlewares;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
    );

    // Мтод що будує залежності у infrstructure рівні
    builder.Services.AddInfrastructureServices(builder.Configuration);

    builder.Services.AddControllers();

    var app = builder.Build();

    // Метод конфігурації папок з рівня інфраструктури
    app.UseImagesDirectory(builder.Configuration);

    app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

    app.UseSerilogRequestLogging();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();



}
catch (Exception ex) when (ex is not OperationCanceledException && ex.GetType().Name != "HostAbortedException")
{
    Log.Fatal(ex, "Application falied to start");
}
finally
{
    Log.CloseAndFlush();
}


