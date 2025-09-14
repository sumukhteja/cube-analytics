# Legacy Frontend (React Demo)

This folder contains a basic React dashboard demo that was used for testing the Cube.js API.

**⚠️ Note**: This is a legacy/demo frontend. The main project is a backend API that can be consumed by any frontend framework.

## Current Demo Features
- Basic React 18 setup
- Cube.js client integration
- Recharts for visualization
- Ant Design components

## For New Frontend Development
Create your new frontend in a separate folder/repository and connect to the Cube.js API at `http://localhost:4000/cubejs-api/v1/`

## API Endpoints
The backend provides REST API endpoints that any frontend can consume:
- `GET /cubejs-api/v1/load` - Query data
- `GET /readyz` - Health check
- Authentication via JWT Bearer token

See main README.md for full API documentation.