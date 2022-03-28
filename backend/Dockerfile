FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /src
COPY ["inertia.csproj", "backend/"]
RUN dotnet restore "backend/inertia.csproj"
COPY . ./backend
WORKDIR "/src/backend"
RUN dotnet build "inertia.csproj" -c Release -o /app/build

FROM build as publish 
RUN dotnet publish "inertia.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "inertia.dll"]