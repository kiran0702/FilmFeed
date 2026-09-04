import { useState } from 'react'
/* eslint-disable react/prop-types, react/no-array-index-key */
import { motion, AnimatePresence } from 'framer-motion'
import { apiSignup, apiLogin, setToken } from '../api'

const MOVIE_POSTERS = [
  'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
  'https://image.tmdb.org/t/p/w300/qNBAXBIQlnOThrVvA6mA2B5ggkR.jpg',
  'https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
  'https://image.tmdb.org/t/p/w300/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
  'https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
]

/* ── Toast ─────────────────────────────────────────────────── */
const Toast = ({ toasts, remove }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm max-w-xs
            ${t.type === 'success' ? 'bg-zinc-900 border-green-500/40' : 'bg-zinc-900 border-red-500/40'}`}
        >
          <span className={`font-bold text-base leading-none ${t.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {t.type === 'success' ? '✓' : '✕'}
          </span>
          <span className="flex-1 text-white">{t.message}</span>
          <button onClick={() => remove(t.id)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
)

let _tid = 0
function useToasts() {
  const [toasts, setToasts] = useState([])
  const add = (message, type = 'success') => {
    const id = ++_tid
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }
  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id))
  return { toasts, add, remove }
}

/* ── Icons ─────────────────────────────────────────────────── */
const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>

/* ── Poster panel ──────────────────────────────────────────── */
const PosterPanel = ({ isLogin }) => (
  <div className="relative w-full h-full overflow-hidden">
    <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-40 scale-110">
      {[...MOVIE_POSTERS, ...MOVIE_POSTERS].map((src, i) => (
        <motion.div key={i} className="aspect-[2/3] bg-gray-800 overflow-hidden rounded"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.6 }}>
          <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
        </motion.div>
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-700/30 rounded-full blur-3xl" />
    <div className="absolute bottom-10 left-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
        <img src="/logo.png" alt="FilmFeed" className="h-10 mb-4 object-contain" />
        {isLogin ? (
          <>
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-[200px] leading-relaxed">Login to continue your movie adventure.</p>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-1 tracking-widest uppercase">Join</p>
            <h2 className="text-3xl font-bold text-white">Film<span className="text-red-500">Feed</span></h2>
            <p className="text-gray-400 text-sm mt-2 max-w-[180px] leading-relaxed">Create an account and start your movie journey.</p>
          </>
        )}
      </motion.div>
    </div>
  </div>
)

/* ── Input field ───────────────────────────────────────────── */
const InputField = ({ icon, type = 'text', placeholder, value, onChange, rightSlot, error }) => (
  <div className="flex flex-col gap-1">
    <div className={`relative flex items-center rounded-lg border transition-all duration-200
      ${error ? 'border-red-500 ring-1 ring-red-500/40' : 'border-zinc-700 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/40'}`}>
      <span className="absolute left-3 text-gray-500">{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full bg-zinc-800/80 text-white placeholder-gray-500 text-sm rounded-lg pl-10 pr-10 py-3 focus:outline-none" />
      {rightSlot && <span className="absolute right-3 text-gray-500 cursor-pointer">{rightSlot}</span>}
    </div>
    {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs pl-1">{error}</motion.p>}
  </div>
)

/* ── Sign Up Form ──────────────────────────────────────────── */
const SignUpForm = ({ onSwitch, onSuccess, addToast }) => {
  const [show, setShow] = useState({ pw: false, cpw: false })
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const data = await apiSignup(form.username, form.email, form.password)
      setToken(data.token)
      addToast('Account created successfully. Welcome to FilmFeed!', 'success')
      setTimeout(() => onSuccess(data.user), 1200)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form key="signup" onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }} className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-gray-500 text-sm mt-1">Sign up to get started</p>
      </div>
      <div className="flex flex-col gap-3">
        <InputField icon={<UserIcon />} placeholder="Username" value={form.username} onChange={set('username')} error={errors.username} />
        <InputField icon={<MailIcon />} type="email" placeholder="Email" value={form.email} onChange={set('email')} error={errors.email} />
        <InputField icon={<LockIcon />} type={show.pw ? 'text' : 'password'} placeholder="Password"
          value={form.password} onChange={set('password')} error={errors.password}
          rightSlot={<button type="button" onClick={() => setShow((s) => ({ ...s, pw: !s.pw }))}><EyeIcon open={show.pw} /></button>} />
        <InputField icon={<LockIcon />} type={show.cpw ? 'text' : 'password'} placeholder="Confirm Password"
          value={form.confirm} onChange={set('confirm')} error={errors.confirm}
          rightSlot={<button type="button" onClick={() => setShow((s) => ({ ...s, cpw: !s.cpw }))}><EyeIcon open={show.cpw} /></button>} />
      </div>
      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
        className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
        {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {loading ? 'Creating account...' : 'Sign Up'}
      </motion.button>

      <p className="text-center text-gray-500 text-sm">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-red-500 hover:text-red-400 font-medium transition-colors">Login</button>
      </p>
    </motion.form>
  )
}

/* ── Login Form ────────────────────────────────────────────── */
const LoginForm = ({ onSwitch, onSuccess, addToast }) => {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((err) => ({ ...err, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const data = await apiLogin(form.email, form.password)
      setToken(data.token)
      addToast('Logged in successfully. Welcome back!', 'success')
      setTimeout(() => onSuccess(data.user), 1200)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form key="login" onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }} className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Login to <span className="text-red-500">FilmFeed</span></h1>
        <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
      </div>
      <div className="flex flex-col gap-3">
        <InputField icon={<MailIcon />} type="email" placeholder="Email" value={form.email} onChange={set('email')} error={errors.email} />
        <InputField icon={<LockIcon />} type={showPw ? 'text' : 'password'} placeholder="Password"
          value={form.password} onChange={set('password')} error={errors.password}
          rightSlot={<button type="button" onClick={() => setShowPw((v) => !v)}><EyeIcon open={showPw} /></button>} />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.remember} onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))} className="w-3.5 h-3.5 accent-red-500 rounded" />
          <span className="text-gray-400 text-xs">Remember me</span>
        </label>
        <button type="button" className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors">Forgot Password?</button>
      </div>
      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
        className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
        {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {loading ? 'Logging in...' : 'Login'}
      </motion.button>

      <p className="text-center text-gray-500 text-sm">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-red-500 hover:text-red-400 font-medium transition-colors">Sign up</button>
      </p>
    </motion.form>
  )
}

/* ── Root ──────────────────────────────────────────────────── */
export default function AuthPage({ onSuccess }) {
  const [mode, setMode] = useState('signup')
  const { toasts, add, remove } = useToasts()
  const isLogin = mode === 'login'

  return (
    <>
      <Toast toasts={toasts} remove={remove} />
      <div className="h-screen w-screen bg-black overflow-hidden flex">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        </div>
        <motion.div layout className="relative w-full h-full bg-zinc-900/95 flex"
          transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}>
          <AnimatePresence mode="wait">
            <motion.div key={isLogin ? 'lp' : 'sp'} className="hidden md:block relative w-5/12 h-full flex-shrink-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <PosterPanel isLogin={isLogin} />
            </motion.div>
          </AnimatePresence>
          <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {isLogin
                  ? <LoginForm key="lf" onSwitch={() => setMode('signup')} onSuccess={onSuccess} addToast={add} />
                  : <SignUpForm key="sf" onSwitch={() => setMode('login')} onSuccess={onSuccess} addToast={add} />}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
