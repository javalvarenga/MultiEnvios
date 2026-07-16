# MultiEnviosGT

Plataforma para gestionar envíos y transacciones de dinero.

`api` y `web` son proyectos **independientes**: cada uno con su `package.json`,
dependencias, lockfile y comandos. No hay monorepo ni scripts compartidos en la raíz.

> Los `pnpm-workspace.yaml` dentro de `api/` y `web/` solo aíslan cada paquete
> del workspace padre (Ithaca). No unen api con web.

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
pnpm dev      # http://localhost:8001 (proxy → API :8000)
pnpm build
pnpm preview
```
