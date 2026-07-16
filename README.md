# MultiEnviosGT

`api` y `web` son proyectos **independientes**. Cada uno tiene su `package.json`
y scripts; Ithaca solo ejecuta esos comandos (`pnpm -C api …` / `pnpm -C web …`).

## API

```bash
cd api
pnpm install
pnpm dev      # http://localhost:8000
pnpm build
pnpm start
```

## Web

```bash
cd web
pnpm install
pnpm dev      # http://localhost:8001
pnpm build
pnpm preview
```
