import './style.css'
import * as api from './api.js'
import { icons } from './icons.js'

const app = document.getElementById('app')
const today = new Date().toISOString().split('T')[0]

const state = {
  token: localStorage.getItem('checkit_token'),
  tasks: [],
  statusFilter: '',
  authMode: 'signin',
  error: '',
  loading: false,
  submitting: false,
  authValues: { username: '', email: '' }
}

function setToken(token) {
  state.token = token
  if (token) localStorage.setItem('checkit_token', token)
  else localStorage.removeItem('checkit_token')
}

async function refreshTasks() {
  state.loading = true
  render()
  try {
    const query = state.statusFilter ? `?status=${state.statusFilter}` : ''
    const res = await api.listTasks(state.token, query)
    state.tasks = res.data
    state.error = ''
  } catch (err) {
    state.error = err.message
  }
  state.loading = false
  render()
}

const field = (id, label, inputHtml) => `
  <div class="flex flex-col gap-1">
    <label for="${id}" class="text-xs text-slate-400">${label}</label>
    ${inputHtml}
  </div>
`

function renderAuth() {
  app.innerHTML = `
    <h1 class="text-2xl font-semibold mb-6">checkit</h1>
    <div class="flex gap-2 mb-4 text-sm" role="tablist" aria-label="Modo de acceso">
      <button data-mode="signin" role="tab" aria-selected="${state.authMode === 'signin'}" class="px-3 py-1 rounded ${state.authMode === 'signin' ? 'bg-indigo-600' : 'bg-slate-800'}">Iniciar sesion</button>
      <button data-mode="signup" role="tab" aria-selected="${state.authMode === 'signup'}" class="px-3 py-1 rounded ${state.authMode === 'signup' ? 'bg-indigo-600' : 'bg-slate-800'}">Crear cuenta</button>
    </div>
    <form id="auth-form" class="flex flex-col gap-3" novalidate>
      ${state.authMode === 'signup' ? field('username', 'Usuario', `<input id="username" name="username" autocomplete="username" value="${state.authValues.username}" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 w-full" required />`) : ''}
      ${field('email', 'Email', `<input id="email" name="email" type="email" autocomplete="email" value="${state.authValues.email}" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 w-full" required />`)}
      ${field('password', 'Contraseña', `<input id="password" name="password" type="password" autocomplete="${state.authMode === 'signup' ? 'new-password' : 'current-password'}" minlength="6" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 w-full" required />`)}
      <button ${state.submitting ? 'disabled' : ''} class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded px-3 py-2 font-medium">
        ${state.submitting ? 'Un momento...' : state.authMode === 'signup' ? 'Crear cuenta' : 'Entrar'}
      </button>
    </form>
    ${state.error ? `<p role="alert" class="text-red-400 text-sm mt-3">${state.error}</p>` : ''}
  `

  app.querySelectorAll('[data-mode]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.authMode = btn.dataset.mode
      state.error = ''
      render()
    })
  )

  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    if (state.submitting) return
    const form = new FormData(e.target)
    const payload = Object.fromEntries(form)
    state.authValues = { username: payload.username || '', email: payload.email || '' }
    state.submitting = true
    state.error = ''
    render()
    try {
      const res = state.authMode === 'signup' ? await api.signUp(payload) : await api.signIn(payload)
      setToken(res.token)
      state.submitting = false
      state.authValues = { username: '', email: '' }
      await refreshTasks()
    } catch (err) {
      state.submitting = false
      state.error = err.message
      render()
    }
  })

  document.getElementById(state.authMode === 'signup' ? 'username' : 'email')?.focus()
}

const PRIORITY_LABEL = { low: 'Baja', medium: 'Media', high: 'Alta' }
const STATUS_LABEL = { pending: 'Pendiente', in_progress: 'En curso', done: 'Hecha' }
const NEXT_STATUS = { pending: 'in_progress', in_progress: 'done', done: 'pending' }

function renderTasks() {
  app.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">checkit</h1>
      <button id="logout" aria-label="Cerrar sesion" title="Cerrar sesion" class="text-slate-400 hover:text-slate-200 rounded p-1.5">${icons.logout}</button>
    </div>

    <form id="task-form" class="flex flex-col gap-2 mb-6" novalidate aria-label="Nueva tarea">
      <label for="title" class="sr-only">Titulo de la tarea</label>
      <input id="title" name="title" placeholder="Nueva tarea" class="bg-slate-900 border border-slate-700 rounded px-3 py-2" required />
      <div class="flex gap-2">
        <label for="priority" class="sr-only">Prioridad</label>
        <select id="priority" name="priority" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1">
          <option value="low">Prioridad baja</option>
          <option value="medium" selected>Prioridad media</option>
          <option value="high">Prioridad alta</option>
        </select>
        <label for="dueDate" class="sr-only">Fecha limite</label>
        <input id="dueDate" name="dueDate" type="date" min="${today}" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1" />
        <button ${state.submitting ? 'disabled' : ''} aria-label="Agregar tarea" title="Agregar tarea" class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded px-4 flex items-center justify-center">
          ${icons.plus}
        </button>
      </div>
    </form>

    <div class="flex gap-2 mb-4 text-sm" role="group" aria-label="Filtrar por estado">
      ${['', 'pending', 'in_progress', 'done']
        .map(
          (s) =>
            `<button data-filter="${s}" aria-pressed="${state.statusFilter === s}" class="px-3 py-1 rounded ${state.statusFilter === s ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}">${s ? STATUS_LABEL[s] : 'Todas'}</button>`
        )
        .join('')}
    </div>

    ${state.error ? `<p role="alert" class="text-red-400 text-sm mb-3">${state.error}</p>` : ''}

    ${
      state.loading
        ? '<p class="text-slate-500 text-sm">Cargando...</p>'
        : `<ul class="flex flex-col gap-2">
      ${state.tasks
        .map(
          (t) => `
        <li class="bg-slate-900 border border-slate-800 rounded px-3 py-2 flex items-center justify-between gap-3">
          <div>
            <p class="font-medium ${t.status === 'done' ? 'line-through text-slate-500' : ''}">${t.title}</p>
            <p class="text-xs text-slate-400">${STATUS_LABEL[t.status]} · Prioridad ${PRIORITY_LABEL[t.priority]}${t.dueDate ? ' · vence ' + new Date(t.dueDate).toLocaleDateString() : ''}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button data-cycle="${t._id}" aria-label="Avanzar estado de ${t.title}" title="Avanzar estado" class="bg-slate-800 hover:bg-slate-700 rounded p-1.5">${icons.arrowRight}</button>
            <button data-delete="${t._id}" aria-label="Borrar ${t.title}" title="Borrar tarea" class="bg-red-900 hover:bg-red-800 rounded p-1.5">${icons.trash}</button>
          </div>
        </li>
      `
        )
        .join('') || '<li class="text-slate-500 text-sm">No hay tareas todavia.</li>'}
    </ul>`
    }
  `

  document.getElementById('logout').addEventListener('click', () => {
    setToken(null)
    state.tasks = []
    render()
  })

  document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    if (state.submitting) return
    const form = new FormData(e.target)
    const payload = Object.fromEntries(form)
    if (!payload.dueDate) delete payload.dueDate
    state.submitting = true
    render()
    try {
      await api.createTask(state.token, payload)
      state.submitting = false
      await refreshTasks()
    } catch (err) {
      state.submitting = false
      state.error = err.message
      render()
    }
  })

  app.querySelectorAll('[data-filter]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.statusFilter = btn.dataset.filter
      refreshTasks()
    })
  )

  app.querySelectorAll('[data-cycle]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const task = state.tasks.find((t) => t._id === btn.dataset.cycle)
      try {
        await api.updateTask(state.token, task._id, { status: NEXT_STATUS[task.status] })
        await refreshTasks()
      } catch (err) {
        state.error = err.message
        render()
      }
    })
  )

  app.querySelectorAll('[data-delete]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const task = state.tasks.find((t) => t._id === btn.dataset.delete)
      if (!confirm(`¿Borrar "${task.title}"? Esta accion no se puede deshacer.`)) return
      try {
        await api.deleteTask(state.token, btn.dataset.delete)
        await refreshTasks()
      } catch (err) {
        state.error = err.message
        render()
      }
    })
  )
}

function render() {
  if (!state.token) renderAuth()
  else renderTasks()
}

render()
if (state.token) refreshTasks()
