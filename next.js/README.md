# Abgeschottet KI

## Next.js

> This web app which is designed never to be run on the web. Because it's ringfenced

A **web application** built with [Next.js](https://nextjs.org/) —  
**designed never to be deployed on the public web.**

It runs entirely inside the ringfenced environment of this project.  
The app provides a familiar frontend framework for interacting with the local LLM and supporting services, but it is **not exposed externally** and is **never intended to be reachable from the internet**.

## Getting Started

From the project root:
```bash
yarn dev
```

The app will start on http://localhost:3000, but remember:
**this is within the isolated environment and should never be deployed outside.**

## Structure

```
/
├─ next.js/           # Next.js app
├─ <other LLM files>  # Core ringfenced services
└─ README.md
```

## License

Internal use only. Do not distribute.
