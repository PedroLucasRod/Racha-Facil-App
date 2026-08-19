# GitHub Copilot Instructions

Você faz parte da equipe de desenvolvimento do projeto Racha Fácil.

Antes de escrever qualquer código, considere sempre os documentos:

- PROJECT_CONTEXT.md
- BUSINESS_RULES.md
- DATABASE.md
- API.md

Caso exista conflito entre eles, BUSINESS_RULES possui prioridade.

---

# Objetivo

Criar um sistema web chamado Racha Fácil.

O sistema organiza rachas de futebol amador.

O foco é simplicidade.

Nunca criar funcionalidades que não estejam descritas na documentação.

---

# Stack

Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query

Backend

- FastAPI
- SQLAlchemy
- Alembic
- SQLite

---

# Princípios

Sempre escrever código limpo.

Sempre utilizar TypeScript.

Nunca utilizar JavaScript.

Nunca duplicar código.

Sempre reutilizar componentes.

Sempre separar responsabilidades.

---

# Estrutura React

Cada página deve possuir sua própria pasta.

Exemplo:

pages/

Login/

Login.tsx

Login.styles.ts (caso necessário)

index.ts

---

Componentes reutilizáveis ficam em:

components/

Exemplo:

Button

Card

Input

Modal

Badge

Avatar

Navbar

BottomNavigation

Loading

EmptyState

---

# Backend

Separar em:

routes

services

repositories

models

schemas

utils

Nunca colocar regra de negócio dentro das rotas.

---

# API

Sempre utilizar REST.

Sempre retornar JSON.

Sempre utilizar códigos HTTP corretos.

---

# Banco

Utilizar SQLAlchemy ORM.

Nunca escrever SQL puro, salvo quando realmente necessário.

---

# Código

Sempre tipar tudo.

Não utilizar "any".

Criar interfaces e tipos reutilizáveis.

---

# Interface

Seguir Material Design 3.

Mobile First.

Botões grandes.

Pouco texto.

Cards reutilizáveis.

Ícones Material Symbols.

---

# UX

Sempre permitir:

Cancelar

Editar

Voltar

Desfazer

Confirmar

Nunca prender o usuário em um fluxo obrigatório.

---

# Componentes

Criar componentes pequenos.

Cada componente deve possuir apenas uma responsabilidade.

---

# Estilo

Utilizar TailwindCSS.

Evitar CSS puro.

Evitar estilos inline.

---

# Comentários

Adicionar comentários apenas quando realmente agregarem valor.

Não comentar código óbvio.

---

# Nomeação

Código em inglês.

Interface em português.

---

# Segurança

Nunca confiar em dados enviados pelo frontend.

Validar tudo no backend.

---

# Objetivo Final

Gerar código limpo, organizado, reutilizável e fácil de manter.

Priorizar legibilidade em vez de soluções extremamente complexas.

O sistema será utilizado como projeto acadêmico e também como portfólio profissional.