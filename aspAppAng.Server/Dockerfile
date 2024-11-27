# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build-env
WORKDIR /App

COPY . ./

RUN dotnet restore 
RUN dotnet publish -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0@sha256:6c4df091e4e531bb93bdbfe7e7f0998e7ced344f54426b7e874116a3dc3233ff
WORKDIR /App
COPY --from=build-env /App/out .

EXPOSE 8080

# Environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_DATAProtection_KeyRingProvider=Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyRingProvider

# Run application
ENTRYPOINT ["dotnet", "aspAppAng.Server.dll"]
