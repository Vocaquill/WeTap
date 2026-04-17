# Hubs
This directory is for SignalR Hubs.
SignalR has been registered in the `DependencyInjection` class in `ProgramConfiguration`.
To add a new hub:
1. Create a class inheriting from `Hub` in this directory.
2. Register it in `Program.cs` using `app.MapHub<YourHub>("/your-path");`.
