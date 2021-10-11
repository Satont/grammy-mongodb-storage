import { MongoClient, Collection } from "https://deno.land/x/mongo@v0.26.0/mod.ts";

const client = new MongoClient()
await client.connect({
  credential: {
    username: 'test',
    password: 'test',
  },
  servers: [{ host: 'localhost', port: 27017 }],
  db: 'testdb'
})

export const createMongoClient = async () => {
  const client = new MongoClient()
  await client.connect({
    servers: [{ host: 'localhost', port: 27017 }],
    db: 'testdb'
  })

  return client
}

export const clearCollection = (col: Collection<any>) => col.deleteMany({})