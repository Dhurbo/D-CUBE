# AI Rubik's Cube Solver with 3D Animation

## Project objective

D-CUBE will help users solve a physical Rubik's Cube. It will eventually read cube-face colours from uploaded images or a camera feed, validate the cube state, calculate a solution, and show the moves in an interactive 3D animation.

This repository currently provides the project foundation only. Computer vision, solving, and 3D animation are intentionally deferred.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI and Python
- **Computer vision (planned):** OpenCV, NumPy, scikit-learn
- **Solver (planned):** kociemba
- **3D animation (planned):** Three.js and React Three Fiber

## Application flow

1. A user uploads images of the cube faces or uses a camera feed.
2. The backend detects sticker colours and builds a cube-state string.
3. The cube state is validated and passed to the solver.
4. The solver returns an ordered list of moves.
5. The frontend animates the moves on a 3D cube and guides the user through them.

## Development phases

1. **Foundation:** local tooling, folders, and API health check.
2. **Cube input:** manual cube-state entry and validation.
3. **Solver:** integrate `kociemba` and expose solution endpoints.
4. **Computer vision:** detect face colours and construct cube states.
5. **3D experience:** animate solution moves with React Three Fiber.
6. **Polish:** responsive UI, tests, error handling, and deployment.

## Run locally

### Backend

Requires Python 3.10+.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`; docs are available at `http://localhost:8000/docs`.

### Frontend

Requires Node.js 18+.

```powershell
cd frontend
npm install
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`). To use a different backend, copy `.env.example` to `.env` and change `VITE_API_URL`.
