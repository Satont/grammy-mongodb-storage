import { session } from 'grammy';
import { MongoClient, Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { MongoDBAdapter } from '../../src/mod';

import { createBot } from './helpers/createBot';
import { createMessage } from './helpers/createMessage';

export interface SessionData {
  pizzaCount: number;
}

let mongod: MongoMemoryServer;
let client: MongoClient
let collection: Collection

beforeEach(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(`${mongod.getUri()}/testdb`)
  await client.connect()
  collection = client.db('testdb').collection('sessions')
});

afterEach(async () => {
  await client.close()
  await mongod.stop()
})

test('Bot should be created', () => {
  expect(createBot()).not.toBeFalsy();
});

describe('Pizza counter test', () => {
  test('Pizza counter should be equals 0 on initial', async () => {
    const bot = createBot<SessionData>();
    const ctx = createMessage(bot);

    bot.use(session({
      initial() {
        return { pizzaCount: 0 };
      },
      storage: new MongoDBAdapter({ collection }),
    }));

    await bot.handleUpdate(ctx.update);

    bot.on('msg:text', (ctx) => {
      expect(ctx.session.pizzaCount).toEqual(0);
    });
  });

  test('Pizza counter should be equals 1 after first message', async () => {
    const bot = createBot<SessionData>();

    bot.use(session({
      initial: () => ({ pizzaCount: 0 }),
      storage: new MongoDBAdapter({ collection }),
    }));

    bot.hears('first', (ctx) => {
      ctx.session.pizzaCount = Number(ctx.session.pizzaCount) + 1;
    });
    
    bot.hears('second', (ctx) => {
      expect(ctx.session.pizzaCount).toEqual(1);
    });
    
    await bot.handleUpdate(createMessage(bot, 'first').update);
    await bot.handleUpdate(createMessage(bot, 'second').update);
  });
});

describe('Test storing of simple string', () => {
  type SimpleString = string

  test('Should equals "test" on initial value', async () => {
    const bot = createBot<SimpleString>();
    const ctx = createMessage(bot);

    bot.use(session({
      initial() {
        return 'test';
      },
      storage: new MongoDBAdapter({ collection }),
    }));

    await bot.handleUpdate(ctx.update);

    bot.on('msg:text', (ctx) => {
      expect(ctx.session).toEqual('test');
    });
  });

  test('Should equals "test edited" on second message', async () => {
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
  });
})