![](https://user-images.githubusercontent.com/70624701/199798229-e1b576ca-a1ba-4f1c-8f4e-2686d96e8162.svg)

<p align="center">
    <img src="https://img.shields.io/tokei/lines/github/vedantnn71/bud">
    <img src="https://img.shields.io/github/languages/top/vedantnn71/bud">
</p>

Bud is an analytics tool that you always wanted to use, it's minimal, fast and privacy focused. It's script is < 1.5kb and doesn't affect your page load times at all.

> NOTE: Bud is highly under development and not in condition to use right now.

# Monorepo

## /apps

- `web`: The bud web app.

## /packages

- `ui`: Reusable components for react
- `config`: Config for tailwind, postcss, etc for whole project.
- `auth`: Next auth related configs and util functions
- `db`: Prisma config and client
- `tracker`: The source code for tracker script
- `api`: TRPC api routes
