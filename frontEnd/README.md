## Staging server

Commits to master will automatically be deployed to:
https://hardcore-shockley-ee14d3.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/9beea904-0fbd-4d34-912a-c919e77c1fda/deploy-status)](https://app.netlify.com/sites/hardcore-shockley-ee14d3/deploys)

## Quickstart

Add the following .env file to this directory and set the value to your local [Fortmatic](https://dashboard.fortmatic.com/login) test key.
```bash
REACT_APP_FORTMATIC_API_KEY=yourfortmatickey
REACT_APP_ASSETS_ENDPOINT=https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/
```

Then, run:

```bash
yarn install
yarn start
```
