# Automize Barber — Sistema Premium

Website institucional + painel SaaS administrativo para barbearia premium, construído com **Next.js (App Router)**, **React**, **CSS Modules**, **Framer Motion** e pronto para deploy na **Vercel**.

## Funcionalidades

### Website
- Hero 100vh com parallax, CTAs e scroll indicator
- Navbar com scroll spy, blur e menu mobile animado
- Seções: Sobre, Serviços, Barbeiros, Galeria (masonry + lightbox), Depoimentos (carousel), CTA final
- Footer completo
- Sistema de agendamento online com validação (Zod + React Hook Form)
- Máscara de telefone, horários dinâmicos e bloqueio de conflitos

### Painel Admin (`/admin`)
- Login premium com glassmorphism
- Dashboard com métricas, gráficos (Recharts) e listas
- CRUD de agendamentos, clientes e barbeiros
- Filtros, busca e status coloridos

## Stack

- Next.js 16 · React 19 · TypeScript
- CSS Modules (sem Tailwind/Bootstrap)
- Framer Motion · React Hook Form · Zod
- Recharts · Lucide React · date-fns
- LocalStorage (preparado para Supabase)

## Início rápido

```bash
npm install
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Agendamento: [http://localhost:3000/agendar](http://localhost:3000/agendar)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Credenciais demo:** `admin` / `admin123`

## Deploy na Vercel

1. Faça push do repositório para o GitHub
2. Importe o projeto em [vercel.com](https://vercel.com)
3. Framework: Next.js (detectado automaticamente)
4. Deploy

## Estrutura

```
app/              # Rotas (site + admin)
components/       # UI, website, admin, booking
context/          # AppContext + AuthContext
hooks/            # Scroll spy, reveal, media query
services/         # Storage + Supabase placeholder
utils/            # Phone, schedule, format
data/             # Seed inicial
types/            # TypeScript
lib/              # Constantes da marca
```

## Supabase (futuro)

Configure em `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

Implemente os métodos em `services/supabase.ts`.

## Personalização

Edite `lib/constants.ts` para alterar nome da marca, contatos, WhatsApp e credenciais admin.

---

Desenvolvido por **[Automize](https://automize-one.vercel.app/)**
