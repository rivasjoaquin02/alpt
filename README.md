# alpt - Advanced Library Populate Tool


## 🚀 Get Started

### Mount the db
```bash
# Load the DB
docker compose up -d 

# Load the Database definitions
docker exec -i alpt-db-1 psql -U postgres library < src/seed.sql

# Install the project
bun install
cpulimit -v -l 300 bun run --bun app.ts
```
