# PROJECT CONTEXT

## Nome do Projeto

Racha Fácil

---

# Visão Geral

O Racha Fácil é um sistema web responsivo (PWA) criado para organizar rachas de futebol amador.

O projeto nasceu para substituir a organização feita atualmente através do WhatsApp, tornando todo o processo mais simples e organizado.

O sistema será utilizado inicialmente por apenas um grupo de futebol organizado pela Tree Company.

O objetivo não é criar uma rede social, mas sim uma ferramenta prática para gerenciamento do evento.

---

# Público-Alvo

Jogadores de futebol amador.

Organizador do racha.

Pessoas com diferentes níveis de conhecimento em tecnologia.

A interface deve ser extremamente simples.

---

# Objetivos

O sistema deverá permitir:

- Criar rachas.
- Confirmar presença.
- Organizar lista de espera.
- Informar o valor estimado por participante.
- Compartilhar a chave PIX.
- Confirmar pagamentos.
- Sortear equipes.
- Alterar equipes manualmente.
- Controlar partidas.
- Controlar cronômetro.
- Registrar gols.
- Exibir ranking.
- Consultar histórico dos rachas.

---

# Escopo

Este sistema NÃO possui:

- Feed
- Curtidas
- Comentários
- Chat
- Mensagens privadas
- Marketplace
- Sistema financeiro integrado
- Pagamento automático
- Notificações Push

---

# Fluxo Principal

Administrador cria um novo racha.

↓

Jogadores confirmam presença.

↓

Administrador confirma pagamentos.

↓

Caso o limite seja atingido, novos participantes entram automaticamente na lista de espera.

↓

No dia do racha o administrador sorteia as equipes.

↓

As equipes podem ser alteradas manualmente.

↓

O administrador inicia as partidas.

↓

Durante as partidas são registrados gols.

↓

Ao final é exibido o ranking do racha.

↓

O racha é encerrado.

↓

Fica disponível no histórico.

---

# Perfis

## Administrador

Pode:

Criar rachas

Editar rachas

Cancelar rachas

Confirmar pagamentos

Sortear equipes

Mover jogadores entre equipes

Criar partidas

Controlar cronômetro

Registrar resultados

Encerrar racha

---

## Jogador

Pode:

Criar conta

Editar perfil

Confirmar presença

Cancelar presença

Visualizar equipes

Visualizar cronômetro

Registrar gols da partida

Consultar ranking

Consultar histórico

---

# Regras importantes

O pagamento NÃO é obrigatório para confirmar presença.

O valor individual é apenas uma estimativa.

Esse valor muda automaticamente conforme aumenta ou diminui a quantidade de participantes confirmados.

O organizador pode alterar praticamente qualquer informação antes do encerramento do racha.

Sempre deve existir possibilidade de:

Editar

Cancelar

Voltar

Desfazer

Confirmar

Nunca bloquear o usuário em uma única tela.

---

# Objetivo da Interface

Interface extremamente limpa.

Poucos botões.

Pouco texto.

Fácil de aprender.

Mobile First.

Seguir Material Design 3.

Seguir Heurísticas de Nielsen.

Seguir WCAG.

---

# Tecnologias

Frontend

React

TypeScript

Vite

TailwindCSS

React Router

TanStack Query

Backend

FastAPI

SQLAlchemy

SQLite

Alembic

JWT Authentication

---

# Arquitetura

Frontend

↓

API REST

↓

Banco de Dados SQLite

---

# Organização

Todo componente deve ser reutilizável.

Nenhuma regra de negócio deve ficar dentro dos componentes React.

Toda regra de negócio deve ficar no backend.

Os componentes devem ser pequenos.

Cada arquivo deve possuir apenas uma responsabilidade.

Sempre utilizar TypeScript.

Sempre utilizar nomes em inglês para código.

Sempre utilizar português apenas para textos apresentados ao usuário.