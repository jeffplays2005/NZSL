# 🇳🇿 NZSL API – New Zealand Sign Language Server

A RESTful API built with C# .NET Core and Entity Framework Core to support learning and managing New Zealand Sign Language (NZSL) resources. 

## Features
* CRUD operations for NZSL entries (e.g., signs, categories, events)
* Organized structure for storing and retrieving sign data
* Built with .NET Core Web API and EF Core for performance and scalability
* Interactive API documentation using Swagger (OpenAPI)
* Clean architecture with validation and error handling (DTOs) for reliability

## Use Cases

* Educational apps that want to embed or retrieve NZSL content
* Admin interfaces for managing and updating NZSL resources
* Backend service for language learning platforms focused on accessibility

## Tech Stack
* .NET Core (C#)
* Entity Framework Core
* Swagger / Swashbuckle for auto-generated API docs
* SQLite / SQL Server for development and production environments

### Running this locally

Install .NET first https://dotnet.microsoft.com/en-us/download

```bash
dotnet restore
dotnet build --no-restore
```
