const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

// ── Token storage ──────────────────────────────────────────────
export const getToken = () => localStorage.getItem('ff_token')
export const setToken = (t) => localStorage.setItem('ff_token', t)
export const clearToken = () => localStorage.removeItem('ff_token')

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` })

// ── Auth ───────────────────────────────────────────────────────
export async function apiSignup(name, email, password) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Signup failed')
  return data // { user, token }
}

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  return data // { user, token }
}

export async function apiGetUser() {
  const res = await fetch(`${BASE}/user/me`, {
    headers: authHeader(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user')
  return data.user
}

async function userPost(path, movie) {
  const res = await fetch(`${BASE}/user${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ movie }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data.user
}

export const toggleFavoriteMovie = (movie) => userPost('/me/favorites/toggle', movie)
export const toggleWatchlistMovie = (movie) => userPost('/me/watchlist/toggle', movie)
export const toggleWatchedMovie = (movie) => userPost('/me/watched/toggle', movie)

// ── Movies ─────────────────────────────────────────────────────
async function movieGet(path) {
  const res = await fetch(`${BASE}/movies${path}`, { headers: authHeader() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const fetchTrending  = () => movieGet('/trending')
export const fetchTrendingTV = () => movieGet('/trending-tv')
export const fetchPopular   = () => movieGet('/popular')
export const fetchTopRated  = () => movieGet('/toprated')
export const fetchUpcoming  = () => movieGet('/upcoming')
export const fetchSearch    = (q) => movieGet(`/search?query=${encodeURIComponent(q)}`)
export const fetchDetails   = (id) => movieGet(`/details/${id}`)
export const fetchCast      = (id) => movieGet(`/${id}/cast`)
export const fetchVideos    = (id) => movieGet(`/${id}/videos`)
export const fetchSimilar   = (id) => movieGet(`/${id}/similar`)

// ── TMDB image helpers ─────────────────────────────────────────
export const imgUrl  = (path, size = 'w500')  =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null
export const backdropUrl = (path) => imgUrl(path, 'w1280')

// ── Profile / Social ───────────────────────────────────────────
export async function apiUpdateProfile(formData) {
  const res = await fetch(`${BASE}/user/me`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Update failed')
  return data.user
}

export async function apiFollowUser(id) {
  const res = await fetch(`${BASE}/user/follow/${id}`, {
    method: 'POST',
    headers: authHeader(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Follow failed')
  return data.user
}

export async function apiUnfollowUser(id) {
  const res = await fetch(`${BASE}/user/unfollow/${id}`, {
    method: 'POST',
    headers: authHeader(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Unfollow failed')
  return data.user
}

// ── Activity ───────────────────────────────────────────────────
export async function apiGetUserActivity(page = 1) {
  const res = await fetch(`${BASE}/activity?page=${page}&limit=10`, {
    headers: authHeader(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch activity')
  return data
}

// ── Reviews ────────────────────────────────────────────────────
export async function apiGetReviews(userId, page = 1) {
  const res = await fetch(`${BASE}/reviews/user/${userId}?page=${page}&limit=10`, {
    headers: authHeader(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch reviews')
  return data
}

export async function apiCreateReview(reviewPayload) {
  const res = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(reviewPayload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create review')
  return data
}
