import { expect } from 'https://deno.land/x/expect/mod.ts'
import { createBot } from './helpers/createBot.ts'

Deno.test('Bot should be created', () => {
  expect(createBot()).not.toBeFalsy()
})