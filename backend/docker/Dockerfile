FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY ../TaskApi/TaskApi.csproj ./
RUN dotnet restore

# Copy the rest of the code
COPY ../TaskApi/ ./

# Build and run
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:5001"] 