# SMARTHOME API - Nodejs

> Control your home in a smarter way

## Required environment
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) v1.22.4 or higher
- [Node.js](https://nodejs.org/en/) v14.17.0 or higher
- [MongoDB](https://www.mongodb.com/try/download/community?tck=docs_server) v4.2.8 or higher

## Optional tool to develop and test
- [MongoDB Compass Community](https://www.mongodb.com/try/download/compass) v1.21.1 or higher
- [Postman](https://www.postman.com/downloads/) v8.5.1 or higher


## Installation

- Change file .env.example into file .env 
- Add your secret key, mongoDB URL, and key for admin, host, and user role to the .env file

```
# Install dependencies (at root folder)
yarn
or
npm install
```
```
# Run in development (at root folder)
yarn dev
or
npm run dev
```

## Testing
- Using Postman
> After running application, copy file at src\test\postman\smarthome.postman_collection.json and import to Postman

- Using your browser
> Add [Json viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh?hl=vi) for your browser
  
### Note
 - [Swagger](https://swagger.io/) - comming soon
 - Copyright (c) 2021 [Vân Đàm](https://github.com/nvan23)