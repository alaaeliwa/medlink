- [ ] Restart Laravel after setting DB to working backend
- [ ] Ensure .env is valid and has correct APP_KEY
- [ ] Decide DB mode:
  - [ ] Option 1: SQLite: set DB_CONNECTION=sqlite and create database/database.sqlite then run migrations.
  - [ ] Option 2: MySQL: ensure MySQL is running on 127.0.0.1:3306 and then run migrations.
- [ ] Run migrate --seed (force/no-interaction if needed)
- [ ] Confirm app loads without 500 errors

