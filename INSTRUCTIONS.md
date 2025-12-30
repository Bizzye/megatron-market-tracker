# Instruções Gerais

## Stack Recomendada

- Frontend: React 18 com TypeScript, Vite para bootstrapping, React Hook Form para formulários, Tailwind CSS (com plugin de forms) e Atomic Design para componentização mínima; Zustand ou Redux Toolkit para estado local e React Query para dados remotos.
- Backend: Node.js 20 com Express, MongoDB via Mongoose, JWT para autenticação, serviços dedicados para OCR e consulta à API externa de códigos de produtos.

## Configuração de Ambiente

- Frontend: variáveis apenas para configurações públicas (ex.: `VITE_API_BASE_URL`).

## Fluxo de Trabalho

1. Planejar features em issues pequenas.
2. Criar branches `feature/<descricao>`.
3. Abrir PR com checklist de testes, lint e acessibilidade.

## Qualidade

- ESLint + Prettier obrigatórios.
- Testes unitários com Vitest/Jest e React Testing Library.
- Lighthouse para performance e acessibilidade.

## Instruções Diretas

- EVITE COMENTÁRIOS
- Utilize pnpm
