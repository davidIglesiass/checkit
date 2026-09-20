import { test } from 'node:test'
import assert from 'node:assert/strict'

// Integration tests against a running stack (`docker compose up`).
// They skip themselves instead of failing the whole run when the API isn't reachable.
const BASE = process.env.API_URL || 'http://localhost:4000'

type AuthResponse = { token: string; message: string }
type TaskResponse = { _id: string }

const isApiUp = async () => {
    try {
        const res = await fetch(BASE)
        return res.ok
    } catch {
        return false
    }
}

const signUp = (body: Record<string, unknown>): Promise<AuthResponse> =>
    fetch(`${BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then((res) => res.json() as Promise<AuthResponse>)

test('signup + task ownership isolation', async (t) => {
    if (!(await isApiUp())) {
        t.skip('API not reachable at ' + BASE + ' — run `docker compose up` first')
        return
    }

    const suffix = Date.now()
    const alice = await signUp({ username: `alice${suffix}`, email: `alice${suffix}@test.com`, password: 'secret123' })
    const bob = await signUp({ username: `bob${suffix}`, email: `bob${suffix}@test.com`, password: 'secret123' })

    assert.ok(alice.token)
    assert.ok(bob.token)

    const createRes = await fetch(`${BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-access-token': alice.token },
        body: JSON.stringify({ title: 'Comprar leche' })
    })
    const task = (await createRes.json()) as TaskResponse
    assert.equal(createRes.status, 201)

    const unauthedRes = await fetch(`${BASE}/api/tasks`)
    assert.equal(unauthedRes.status, 403)

    const bobReadRes = await fetch(`${BASE}/api/tasks/${task._id}`, {
        headers: { 'x-access-token': bob.token }
    })
    assert.equal(bobReadRes.status, 404)

    const bobDeleteRes = await fetch(`${BASE}/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': bob.token }
    })
    assert.equal(bobDeleteRes.status, 404)

    const aliceReadRes = await fetch(`${BASE}/api/tasks/${task._id}`, {
        headers: { 'x-access-token': alice.token }
    })
    assert.equal(aliceReadRes.status, 200)
})
