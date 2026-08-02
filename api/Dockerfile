# ---- build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore before copying sources so dependency layers stay cached when only
# application code changes.
COPY Directory.Build.props Directory.Packages.props BelanjaYuk.sln ./
COPY src/BelanjaYuk.Domain/*.csproj src/BelanjaYuk.Domain/
COPY src/BelanjaYuk.Application/*.csproj src/BelanjaYuk.Application/
COPY src/BelanjaYuk.Infrastructure/*.csproj src/BelanjaYuk.Infrastructure/
COPY src/BelanjaYuk.Api/*.csproj src/BelanjaYuk.Api/
RUN dotnet restore

COPY . .
RUN dotnet publish src/BelanjaYuk.Api -c Release -o /app --no-restore

# ---- runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# The base image ships a non-root `app` user (UID 1654); creating one manually
# is unnecessary and the image no longer bundles adduser.
USER app

COPY --from=build --chown=app:app /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "BelanjaYuk.Api.dll"]