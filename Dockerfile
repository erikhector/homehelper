# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend-build
WORKDIR /src/Frontend
COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm ci
COPY Frontend/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY Backend/*.csproj Backend/
RUN dotnet restore Backend/HomeHelper.csproj
COPY Backend/ Backend/
COPY --from=frontend-build /src/Frontend/dist Backend/wwwroot
RUN dotnet publish Backend/HomeHelper.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "ASPNETCORE_HTTP_PORTS=${PORT:-8080} exec dotnet HomeHelper.dll"]
