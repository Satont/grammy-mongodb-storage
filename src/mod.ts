import { StorageAdapter, Collection } from './deps.deno.ts';

export interface ISession {
  _id: { $oid: string };
  key: string;
  value: string;
}

export class MongoDBAdapter<T> implements StorageAdapter<T> {
  private collection: Collection<ISession>

  constructor({ collection }: { collection: Collection<ISession> }) {
    this.collection = collection
  }
 
  async read(key: string) {
    const session = await this.collection.findOne({ key })

    if (session === null || session === undefined) {
      return undefined;
    }
    return JSON.parse(session.value) as unknown as T;
  }

  async write(key: string, data: T) {
    await this.collection.updateOne({ key }, { data }, { upsert: true })
  }

  async delete(key: string) {
    await this.collection.deleteOne({ key })
  }
}
