# initial installation of packages
# dotnet tool install --global dotnet-ef
# dotnet tool update --global dotnet-ef
# dotnet add package Microsoft.EntityFrameworkCore.Sqlite
# dotnet add package Microsoft.EntityFrameworkCore.Tools
# dotnet add package Microsoft.EntityFrameworkCore.Design

# runs the migrations to create the database
# dotnet migrations remove
# dotnet ef migrations add InitialCreate
# to update the database
dotnet ef database update
