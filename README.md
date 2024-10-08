# Pong Tournament App
---

#### Getting Started
---

1. Ensure the following are installed:
    - [`poetry`](https://python-poetry.org/docs/#installation), the package management tool for Python we will be using. This project uses Python `3.10`.
    - [`npm` and Node.js](https://nodejs.org/en/download/)

2. Clone this repository

3. In the root folder, run `poetry install`. This will set up a virtualenv with all dependencies installed.

4. Create a file named `.env` with `ENV=local` as it's content. (in the root folder)

5. Create a file name `.env` in the `frontend` folder with the following content:

   ```
   REACT_APP_SERVER_URL=http://localhost:8000
   REACT_APP_FRONTEND_URL=http://localhost:3000
   REACT_APP_WS_PATH=graphql
   ```

6. Run `poetry run alembic upgrade head` in the root folder. This will create a `db.sqlite3` file and set up the projects table schema and data.
    - To add your own user account as initial data, head to `backend/alembic/versions/2a7[...]_add_initial_data.py` and modify that script before running the `upgrade head` command above.

7. Run: `npm i` (in the `frontend` folder)

8. Install the ESLint VSCode extension to enable linting

9. Run: `npm run build` (in the `frontend` folder)

10. Run: `poetry run uvicorn main:app --reload` (in the root folder where `main.py` lives)

12. Go to `http://localhost:8000` in your browser

#### GraphQL Explorer

---

- To access the Strawberry GraphQL Explorer, go to `http://localhost:8000/graphql/` in your browser

- Example queries can be found at the wiki, [here](https://github.com/Yohlo/tournament-app/wiki/GraphQL-Basic-Queries). Copy and paste them all into the editor, press the run button and select your query. The `login` mutation is required before all other queries.