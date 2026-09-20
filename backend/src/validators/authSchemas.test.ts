import { test } from 'node:test'
import assert from 'node:assert/strict'
import { signUpSchema, signInSchema } from './authSchemas.ts'

test('signUpSchema rejects an invalid email', () => {
    const result = signUpSchema.safeParse({ username: 'alice', email: 'not-an-email', password: 'secret123' })
    assert.equal(result.success, false)
})

test('signUpSchema rejects a short password', () => {
    const result = signUpSchema.safeParse({ username: 'alice', email: 'alice@test.com', password: '123' })
    assert.equal(result.success, false)
})

test('signUpSchema accepts a valid payload', () => {
    const result = signUpSchema.safeParse({ username: 'alice', email: 'alice@test.com', password: 'secret123' })
    assert.equal(result.success, true)
})

test('signInSchema requires both email and password', () => {
    const result = signInSchema.safeParse({ email: 'alice@test.com' })
    assert.equal(result.success, false)
})
