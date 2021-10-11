# MongoDB storage adapter for grammY

Storage adapter that can be used to
[store your session data](https://grammy.dev/plugins/session.html) with
[MongoDB](https://www.mongodb.com/) when using sessions.

Compatible with deno and node!

## Installation

Node

```bash
npm install @satont/grammy-mongodb-storage --save
```

Deno

```ts
import {
  ISession,
  MongoDBAdapter,
} from "https://deno.land/x/grammy_mongodb_storage/mod.ts";
```

## Usage

You can check
[examples](https://github.com/Satont/grammy-typeorm-storage/tree/main/examples)
folder, which contains deno and node examples.:
