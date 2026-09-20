import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createTaskSchema, updateTaskSchema } from './taskSchemas.ts'

test('createTaskSchema rejects a missing title', () => {
    const result = createTaskSchema.safeParse({ description: 'sin titulo' })
    assert.equal(result.success, false)
})

test('createTaskSchema rejects an invalid status', () => {
    const result = createTaskSchema.safeParse({ title: 'ok', status: 'not-a-status' })
    assert.equal(result.success, false)
})

test('createTaskSchema accepts a minimal valid task and applies defaults from the model, not the schema', () => {
    const result = createTaskSchema.safeParse({ title: 'Comprar leche' })
    assert.equal(result.success, true)
    assert.equal(result.data.title, 'Comprar leche')
})

test('createTaskSchema trims the title', () => {
    const result = createTaskSchema.safeParse({ title: '  Comprar leche  ' })
    assert.equal(result.success, true)
    assert.equal(result.data.title, 'Comprar leche')
})

test('updateTaskSchema allows a partial payload', () => {
    const result = updateTaskSchema.safeParse({ status: 'done' })
    assert.equal(result.success, true)
})
