# Environment Configuration

This project supports different environment configurations for development and production.

## Environment Files

- `.env.development` - Used for local development
- `.env.production` - Used for production deployment

## Available Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Base URL for API requests |
| VITE_APP_NAME | Application name |
| VITE_APP_URL | Application URL |

## Usage

### Development

To run the application in development mode with development environment variables:

```bash
npm run dev
# or
yarn dev
```

To run the application in development mode but with production environment variables (for testing):

```bash
npm run dev:prod
# or
yarn dev:prod
```

### Building

To build the application for production:

```bash
npm run build
# or
yarn build
```

To build the application with development environment variables:

```bash
npm run build:dev
# or
yarn build:dev
```

## How It Works

Vite automatically loads the appropriate environment file based on the mode:

- In development mode, it loads `.env.development`
- In production mode, it loads `.env.production`

The mode is specified by the `--mode` flag in the npm/yarn scripts.

## Accessing Environment Variables

In your code, you can access environment variables using:

```javascript
import.meta.env.VITE_API_BASE_URL
import.meta.env.VITE_APP_NAME
import.meta.env.VITE_APP_URL
```

Only variables prefixed with `VITE_` are exposed to your client-side code.
