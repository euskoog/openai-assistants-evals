# OpenAI Assistants Evals

_Remix dashboard for analyzing LLM evaluations_

---

[![Twitter Follow](https://img.shields.io/twitter/follow/euskoog?style=social)](https://twitter.com/euskoog)

You can access the live demo [here](https://openai-assistants-evals-dash.vercel.app/).

## ❓ What This Is

OpenAI Assistants Evals is a repo for analyzing LLM evaluations. It acts as a guide for understanding how to collect custom
evaluations on OpenAI Assistants. The repository features two main pages:

- Home (blogpost on method and reasoning)
- Evaluations (interactive dashboard)

All data is set up and collected through an adjacent API project, [OpenAI Assistants Link](https://github.com/euskoog/openai-assistants-link). If you want to set up your own evaluations exactly like I have, I would recommend checking out the Link repo to create your own API and database connections.

![image](/public/dashboard.png)

##### All data that is displayed in the dashboard is my own local data.

## 🚀 Getting Started

If you want to run this project locally with your own data, you will first need to follow the instructions from the [OpenAI Assistants Link](https://github.com/euskoog/openai-assistants-link) repo. Once you have completed all of those steps, you should have a railway deployment link for your live server. (This will still work even if you use a different hosting service) This link is important because this FE project uses the npm package `openapi-typescript-codegen`, which generates a local lib for your API types and endpoints. This makes setting up network requests a breeze.

Assuming you have a valid API link, you will need to create a `.env` file and store your variable as:

```
API_URL=<YOUR API LINK>
```

Once this is complete, you will just need to install the required npm packages and run the app.

Install dependencies:

```
pnpm i
```

Run codegen, build, and local server:

```
pnpm dev
```

This should set you up to run the dashboard with your local data.
