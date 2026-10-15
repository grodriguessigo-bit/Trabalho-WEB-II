# Trabalho-WEB-II

## Maintenance requests by client

`GET /api/maintenance-requests/client/{clientId}` returns the client's requests,
ordered by request date and then by ID, both ascending. The response uses the
same fields as `GET /api/maintenance-requests`. Clients without requests return
an empty array. Invalid or non-positive IDs return HTTP 400.

Run the backend unit and HTTP tests without a database:

```sh
cd backend
bash mvnw -Dtest=CategoryServiceTest,MaintenanceRequestReadTest,MaintenanceRequestClientTest test
```
