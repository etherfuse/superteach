This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
<br/>
This project is using Nextjs + Tailwind + HeadlessUI + HeroIcons

## Getting Started

First, install dependencies and run development server:

```bash
yarn
yarn dev
```

## Setup

The Project has several branches depending of the starter point that you need. <br/>
Main branch is the simplest and it should be fine for static simple websites.<br/><br/>
For a simple Website you should configure: <br/>

- Seo, Header and Footer Components <br/>
- Logo, OG and favicon images

```
Branch wmongodb needs env variables.
MONGODB_DB=
MONGODB_URI=

//this is used for nextauth
BASE_SECRET="yoursecrethere"
NEXTAUTH_URL=http://localhost:3000

//To sending emails using SMTP
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```
