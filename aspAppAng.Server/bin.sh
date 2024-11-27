#!/bin/bash
# Install the dotnet-ef tool globally
dotnet tool install --global dotnet-ef

# Export the PATH so dotnet-ef can be accessed
export PATH="$PATH:/root/.dotnet/tools"

# Run the migrations
dotnet ef migrations add first
dotnet ef database update

# Start the application
dotnet aspAppAng.Server.dll
