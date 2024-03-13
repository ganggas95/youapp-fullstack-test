run-frontend:
	sh -c "cd frontend && yarn dev -p 3001"

run-backend:
	sh -c "docker compose up -d"

build-frontend:
	sh -c "cd frontend && yarn build"