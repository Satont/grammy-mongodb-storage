import { expect } from 'https://deno.land/x/expect/mod.ts'
import { session } from "https://deno.land/x/grammy@v1.3.3/mod.ts";
import { createBot } from './helpers/createBot.ts'
import { createMessage } from "./helpers/createMessage.ts";
import { clearCollection, createMongoClient } from "./helpers/mongo.ts";
import { MongoDBAdapter } from '../../src/mod.ts'

interface SessionData {
  pizzaCount: number;
}

Deno.test('Bot should be created', () => {
  expect(createBot()).not.toBeFalsy()
})

Deno.test('Pizza counter tests', async () => {
  const client = await createMongoClient()
  const db = client.database('testdb')
  const collection = db.collection<any>('sessions')

  const bot = createBot<SessionData>();

  bot.use(session({
    initial: () => ({ pizzaCount: 0 }),
    storage: new MongoDBAdapter({ collection }),
  }));

  bot.hears('first', (ctx) => {
    expect(ctx.session.pizzaCount).toEqual(0)
    ctx.session.pizzaCount = Number(ctx.session.pizzaCount) + 1;
  });
  
  bot.hears('second', (ctx) => {
    expect(ctx.session.pizzaCount).toEqual(1);
  });
  
  await bot.handleUpdate(createMessage(bot, 'first').update);
  await bot.handleUpdate(createMessage(bot, 'second').update);

  await clearCollection(collection)
  client.close()
})

Deno.test('Simple string tests', async () => {
  const client = await createMongoClient()
  const db = client.database('testdb')
  const collection = db.collection<any>('sessions')

  type SimpleString = string
  const bot = createBot<SimpleString>();

  bot.use(session({
    initial() {
      return 'test';
    },
    storage: new MongoDBAdapter({ collection }),
  }));

  bot.hears('first', async (ctx) => {
    ctx.session = `${ctx.session} edited`;
  });
  
  bot.hears('second', async (ctx) => {
    expect(ctx.session).toEqual('test edited');
  });
  
  await bot.handleUpdate(createMessage(bot, 'first').update);
  await bot.handleUpdate(createMessage(bot, 'second').update);

  await clearCollection(collection)
  client.close()
})