import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Check, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, CreditCard, DollarSign, LayoutDashboard,
  ListTodo, Menu, MessageCircle, MoreHorizontal, Plus, Send, Settings2, Sparkles, Target,
  TimerReset, Trash2, Wallet, X, Zap, Brain, Lightbulb, Youtube, ExternalLink, LoaderCircle, Palette, UserRound, ShieldCheck, Moon, Sun, Save, RotateCcw, Trophy, BookOpen, Flame, CalendarCheck, Star
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

const initialTasks = [
  { id: 1, title: 'Review React component basics', category: 'Study', priority: 'High', done: false },
  { id: 2, title: 'Finish presentation outline', category: 'College', priority: 'High', done: false },
  { id: 3, title: 'Read 10 pages of notes', category: 'Study', priority: 'Medium', done: true },
  { id: 4, title: 'Organize tomorrow’s to-do list', category: 'Personal', priority: 'Low', done: false },
]
const initialExpenses = [
  { id: 11, title: 'Coffee & snack', category: 'Food', amount: 120, date: todayISO() },
  { id: 12, title: 'Metro ride', category: 'Travel', amount: 60, date: todayISO() },
  { id: 13, title: 'Notebook', category: 'Study', amount: 180, date: daysAgoISO(2) },
]
function todayISO() { return new Date().toISOString().slice(0, 10) }
function daysAgoISO(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10) }
function readStore(key, fallback) {
  try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : fallback }
  catch { return fallback }
}
function money(n) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0) }
function shortDate(date) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'My tasks', icon: ListTodo },
  { id: 'missions', label: 'Daily missions', icon: Trophy },
  { id: 'focus', label: 'Focus timer', icon: Target },
  { id: 'expenses', label: 'Expenses', icon: Wallet },
  { id: 'ai', label: 'AI Assistant', icon: Brain },
  { id: 'settings', label: 'Settings & profile', icon: Settings2 },
]

export default function App() {
  const [active, setActive] = useState('overview')
  const [session, setSession] = useState(() => readStore('focusflow-session', null))
  const [loginName, setLoginName] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [theme, setTheme] = useState(() => readStore('focusflow-theme', 'violet'))
  const [profile, setProfile] = useState(() => readStore('focusflow-profile', { name: 'My workspace', email: '', phone: '', studyGoal: 'Build a consistent study routine' }))
  const [profileDraft, setProfileDraft] = useState(() => readStore('focusflow-profile', { name: 'My workspace', email: '', phone: '', studyGoal: 'Build a consistent study routine' }))
  const [mobileMenu, setMobileMenu] = useState(false)
  const [tasks, setTasks] = useState(() => readStore('focusflow-tasks', initialTasks))
  const [missions, setMissions] = useState(() => readStore('focusflow-missions', [
    { id: 'mission-plan', title: 'Plan your top 3 priorities', detail: 'Choose what matters most today', points: 10, done: false, icon: 'plan' },
    { id: 'mission-focus', title: 'Complete one focus session', detail: 'Try a 25-minute deep-work sprint', points: 25, done: false, icon: 'focus' },
    { id: 'mission-learn', title: 'Learn one small concept', detail: 'Study a topic or watch a tutorial', points: 20, done: false, icon: 'learn' },
    { id: 'mission-review', title: 'Review your day', detail: 'Mark tasks done and notice your progress', points: 15, done: false, icon: 'review' },
  ]))
  const [expenses, setExpenses] = useState(() => readStore('focusflow-expenses', initialExpenses))
  const [budget, setBudget] = useState(() => readStore('focusflow-budget', 6000))
  const [focusMinutes, setFocusMinutes] = useState(() => readStore('focusflow-focus-minutes', 0))
  const [universe, setUniverse] = useState(() => readStore('focusflow-universe', { stars: 0, points: 0, sessions: 0 }))
  const [taskModal, setTaskModal] = useState(false)
  const [expenseModal, setExpenseModal] = useState(false)
  const [toast, setToast] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskCategory, setTaskCategory] = useState('Study')
  const [taskPriority, setTaskPriority] = useState('Medium')
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('Food')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState(todayISO())
  const [budgetDraft, setBudgetDraft] = useState(String(budget))
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiConnected, setAiConnected] = useState(false)
  const [videoTopic, setVideoTopic] = useState('')
  const [aiMessages, setAiMessages] = useState([{ role: 'assistant', text: 'Hi! I’m your FocusFlow planning assistant. Ask me to prioritize tasks, plan a study session, or review your spending. This demo uses your saved dashboard data and local rules.' }])

  useEffect(() => { localStorage.setItem('focusflow-tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem('focusflow-missions', JSON.stringify(missions)) }, [missions])
  useEffect(() => { localStorage.setItem('focusflow-expenses', JSON.stringify(expenses)) }, [expenses])
  useEffect(() => { localStorage.setItem('focusflow-budget', JSON.stringify(budget)) }, [budget])
  useEffect(() => { localStorage.setItem('focusflow-focus-minutes', JSON.stringify(focusMinutes)) }, [focusMinutes])
  useEffect(() => { localStorage.setItem('focusflow-universe', JSON.stringify(universe)) }, [universe])
  useEffect(() => { localStorage.setItem('focusflow-theme', JSON.stringify(theme)) }, [theme])
  useEffect(() => { localStorage.setItem('focusflow-profile', JSON.stringify(profile)) }, [profile])
  useEffect(() => { if (session) localStorage.setItem('focusflow-session', JSON.stringify(session)); else localStorage.removeItem('focusflow-session') }, [session])

  useEffect(() => { fetch('/api/status').then(response => response.ok ? response.json() : null).then(data => setAiConnected(Boolean(data?.aiConfigured))).catch(() => setAiConnected(false)) }, [])

  useEffect(() => {
    if (!timerRunning) return undefined
    const interval = window.setInterval(() => {
      setSecondsLeft(current => {
        if (current <= 1) {
          window.clearInterval(interval)
          setTimerRunning(false)
          const earnedMinutes = Math.ceil((timerMinutes * 60 + timerSeconds) / 60)
          setFocusMinutes(value => value + earnedMinutes)
          setUniverse(current => ({ ...current, stars: current.stars + 1, sessions: current.sessions + 1, points: current.points + earnedMinutes }))
          playCompletionSound()
          setToast(`Session complete! +1 star and +${earnedMinutes} Focus Points ✨`)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning, timerMinutes, timerSeconds])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const completedCount = tasks.filter(task => task.done).length
  const openCount = tasks.length - completedCount
  const spent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const remaining = Math.max(budget - spent, 0)
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const chartData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now)
      date.setDate(now.getDate() - (6 - index))
      const key = date.toISOString().slice(0, 10)
      const amount = expenses.filter(item => item.date === key).reduce((sum, item) => sum + Number(item.amount), 0)
      return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), amount }
    })
  }, [expenses])
  const timerDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  function choosePage(id) { setActive(id); setMobileMenu(false) }
  function toggleMission(id) {
    setMissions(current => current.map(mission => mission.id === id ? { ...mission, done: !mission.done } : mission))
    const mission = missions.find(item => item.id === id)
    if (mission) setToast(mission.done ? 'Mission moved back to your list' : `Mission complete! +${mission.points} points ✨`)
  }
  function addTask(event) {
    event.preventDefault()
    if (!taskTitle.trim()) return
    setTasks(current => [{ id: Date.now(), title: taskTitle.trim(), category: taskCategory, priority: taskPriority, done: false }, ...current])
    setTaskTitle(''); setTaskCategory('Study'); setTaskPriority('Medium'); setTaskModal(false); setToast('Task added to your list')
  }
  function addExpense(event) {
    event.preventDefault()
    const amount = Number(expenseAmount)
    if (!expenseTitle.trim() || !Number.isFinite(amount) || amount <= 0) return
    setExpenses(current => [{ id: Date.now(), title: expenseTitle.trim(), category: expenseCategory, amount, date: expenseDate }, ...current])
    setExpenseTitle(''); setExpenseAmount(''); setExpenseCategory('Food'); setExpenseDate(todayISO()); setExpenseModal(false); setToast('Expense saved')
  }
  function setTimerDuration(minutes, seconds = 0) { const safeMinutes = Math.max(0, Math.min(180, Number(minutes) || 0)); const safeSeconds = Math.max(0, Math.min(59, Number(seconds) || 0)); const total = safeMinutes * 60 + safeSeconds; if (!total) return; setTimerMinutes(safeMinutes); setTimerSeconds(safeSeconds); setSecondsLeft(total); setTimerRunning(false) }
  function resetTimer() { setTimerRunning(false); setSecondsLeft(timerMinutes * 60 + timerSeconds) }
  function signIn(event) { event.preventDefault(); const name = loginName.trim() || loginEmail.trim().split('@')[0] || 'FocusFlow user'; const next = { name, email: loginEmail.trim() }; setSession(next); setProfile(current => ({ ...current, name, email: next.email })); setProfileDraft(current => ({ ...current, name, email: next.email })); setToast('Welcome to FocusFlow!') }
  function signOut() { setSession(null); setToast('You have signed out') }
  async function askAssistant(event) {
    event.preventDefault()
    const question = aiInput.trim()
    if (!question || aiLoading) return
    setAiMessages(messages => [...messages, { role: 'user', text: question }])
    setAiInput('')
    setAiLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: {
            tasks: tasks.map(({ title, category, priority, done }) => ({ title, category, priority, done })),
            expenses: expenses.map(({ title, category, amount, date }) => ({ title, category, amount, date })),
            budget, spent, focusMinutes,
          },
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'AI service unavailable. Check your backend and API key setup.')
      setAiMessages(messages => [...messages, { role: 'assistant', text: data.answer || 'I could not generate a response. Please try again.' }])
      setAiConnected(true)
    } catch (error) {
      const pending = tasks.filter(task => !task.done)
      const fallback = `AI connection is not ready yet. ${error.message}

Quick local suggestion: ${pending.length ? `start with “${[...pending].sort((a,b) => (({ High: 0, Medium: 1, Low: 2 }[a.priority] ?? 1) - ({ High: 0, Medium: 1, Low: 2 }[b.priority] ?? 1)))[0].title}”, then focus for 25 minutes.` : 'Add a study task and I can help you organize it once the AI backend is connected.'}

To enable real AI, add GROQ_API_KEY to the project root .env file and restart the server.`
      setAiMessages(messages => [...messages, { role: 'assistant', text: fallback }])
    } finally {
      setAiLoading(false)
    }
  }

  if (!session) return <LoginPage name={loginName} setName={setLoginName} email={loginEmail} setEmail={setLoginEmail} onSubmit={signIn} theme={theme} />

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><Sparkles size={20} /></span><span>focusflow<span className="brand-dot">.</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(item => {
            const Icon = item.icon
            return <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => choosePage(item.id)}>
              <Icon size={18} strokeWidth={2} /><span>{item.label}</span>{item.id === 'tasks' && <span className="nav-count">{openCount}</span>}
            </button>
          })}
          <button className="nav-item universe-nav-item" onClick={() => choosePage('overview')} title="Open the Focus Universe card on Overview"><Star size={18} strokeWidth={2} /><span>Focus Universe</span><span className="nav-count">★</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-card"><div className="tip-icon"><Zap size={17} /></div><strong>A little progress adds up.</strong><p>Small, focused steps make big goals feel possible.</p><div className="tip-decoration">✳</div></div>
          <div className="profile"><div className="avatar">{(profile.name || 'FF').trim().slice(0,2).toUpperCase()}</div><div className="profile-copy"><strong>{profile.name || 'My workspace'}</strong><span>Personal workspace</span></div><MoreHorizontal size={19} className="profile-more" /></div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{navItems.find(item => item.id === active)?.label || 'Overview'}</strong></div>
          <div className="topbar-right"><span className="today-label">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast('You’re all caught up!')}><Bell size={18} /><i /></button><div className="top-avatar">{(profile.name || 'S').trim().slice(0,1).toUpperCase()}</div></div>
        </header>

        <div className="page-wrap">
          {active === 'overview' && <Overview
            tasks={tasks} completedCount={completedCount} openCount={openCount} focusMinutes={focusMinutes}
            spent={spent} remaining={remaining} budget={budget} progress={progress} expenses={expenses}
            chartData={chartData} universe={universe} onNavigate={choosePage} onAddTask={() => setTaskModal(true)}
            onAddExpense={() => setExpenseModal(true)} onToggleTask={id => setTasks(items => items.map(t => t.id === id ? { ...t, done: !t.done } : t))}
          />}
          {active === 'missions' && <MissionsPage missions={missions} onToggle={toggleMission} onNavigate={choosePage} /> }
          {active === 'tasks' && <TasksPage tasks={tasks} onAdd={() => setTaskModal(true)} onToggle={id => setTasks(items => items.map(t => t.id === id ? { ...t, done: !t.done } : t))} onDelete={id => setTasks(items => items.filter(t => t.id !== id))} />}
          {active === 'focus' && <FocusPage timerDisplay={timerDisplay} timerRunning={timerRunning} timerMinutes={timerMinutes} timerSeconds={timerSeconds} secondsLeft={secondsLeft} onDuration={setTimerDuration} onToggle={() => { if (secondsLeft === 0) setSecondsLeft(timerMinutes * 60 + timerSeconds); setTimerRunning(running => !running) }} onReset={resetTimer} focusMinutes={focusMinutes} universe={universe} />}
          {active === 'expenses' && <ExpensesPage expenses={expenses} spent={spent} budget={budget} remaining={remaining} progress={progress} budgetDraft={budgetDraft} setBudgetDraft={setBudgetDraft} onBudgetSave={() => { const value = Number(budgetDraft); if (Number.isFinite(value) && value > 0) { setBudget(value); setToast('Monthly budget updated') } }} onAdd={() => setExpenseModal(true)} onDelete={id => setExpenses(items => items.filter(e => e.id !== id))} />}
          {active === 'settings' && <SettingsPage theme={theme} setTheme={setTheme} profileDraft={profileDraft} setProfileDraft={setProfileDraft} onSaveProfile={() => { const next = { ...profileDraft, name: profileDraft.name.trim() || 'My workspace' }; setProfile(next); setProfileDraft(next); setToast('Profile preferences saved on this device') }} onReset={() => { setTheme('violet'); setProfileDraft({ name: 'My workspace', email: '', phone: '', studyGoal: 'Build a consistent study routine' }); setToast('Settings reset to defaults') }} /> }
          {active === 'ai' && <AIAssistant tasks={tasks} expenses={expenses} budget={budget} spent={spent} focusMinutes={focusMinutes} messages={aiMessages} input={aiInput} setInput={setAiInput} onSubmit={askAssistant} onPrompt={prompt => { setAiInput(prompt) }} loading={aiLoading} connected={aiConnected} videoTopic={videoTopic} setVideoTopic={setVideoTopic} />}
          <footer className="footer"><span>FocusFlow · Personal productivity</span></footer>
        </div>
      </main>

      {taskModal && <Modal title="Add a new task" onClose={() => setTaskModal(false)}><form className="form-stack" onSubmit={addTask}>
        <label>Task name<input autoFocus value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g. Prepare presentation slides" required maxLength={100} /></label>
        <div className="form-row"><label>Category<select value={taskCategory} onChange={e => setTaskCategory(e.target.value)}><option>Study</option><option>College</option><option>Personal</option><option>Work</option></select></label><label>Priority<select value={taskPriority} onChange={e => setTaskPriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label></div>
        <button className="primary-button full-button" type="submit"><Plus size={17} /> Add task</button>
      </form></Modal>}
      {expenseModal && <Modal title="Add an expense" onClose={() => setExpenseModal(false)}><form className="form-stack" onSubmit={addExpense}>
        <label>What did you spend on?<input autoFocus value={expenseTitle} onChange={e => setExpenseTitle(e.target.value)} placeholder="e.g. Lunch" required maxLength={80} /></label>
        <div className="form-row"><label>Amount (₹)<input type="number" min="1" step="1" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="250" required /></label><label>Category<select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)}><option>Food</option><option>Travel</option><option>Study</option><option>Shopping</option><option>Other</option></select></label></div>
        <label>Date<input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} required /></label>
        <button className="primary-button full-button" type="submit"><Plus size={17} /> Save expense</button>
      </form></Modal>}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button aria-label="Dismiss message" onClick={() => setToast('')}><X size={15} /></button></div>}
    </div>
  )
}

function AIAssistant({ tasks, expenses, budget, spent, focusMinutes, messages, input, setInput, onSubmit, onPrompt, loading, connected, videoTopic, setVideoTopic }) {
  const pending = tasks.filter(task => !task.done).length
  const suggestedTask = tasks.find(task => !task.done && ['Study', 'College'].includes(task.category))
  const prompts = ['Build a realistic study plan for today', 'Explain a difficult topic simply', 'Which tasks should I do first?', 'Summarize my spending and suggest savings']
  const topic = videoTopic.trim() || suggestedTask?.title || ''
  const [videoResults, setVideoResults] = useState([])
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState('')
  async function searchVideos(event) {
    event.preventDefault()
    if (!topic || videoLoading) return
    setVideoLoading(true); setVideoError(''); setVideoResults([])
    try {
      const response = await fetch(`/api/videos?q=${encodeURIComponent(topic)}`)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'YouTube search failed.')
      setVideoResults(data.videos || [])
      if (!data.videos?.length) setVideoError('No videos found for this topic. Try another search.')
    } catch (error) { setVideoError(error.message || 'Could not search YouTube.') }
    finally { setVideoLoading(false) }
  }
  return <>
    <PageHeading eyebrow="YOUR PERSONAL LEARNING COMPANION" title="AI Study Studio" subtitle="Plan smarter, understand topics, and find learning resources in one place." />
    <div className="ai-hero"><div className="ai-hero-copy"><span className="ai-hero-pill"><Sparkles size={13}/> YOUR STUDY COPILOT</span><h2>Make your next study session count.</h2><p>Get a study plan based on your tasks, then jump straight into a helpful video.</p><div className="ai-hero-status"><span className={connected ? 'status-dot online' : 'status-dot'} />{connected ? 'Groq AI connected' : 'AI setup needed · follow setup guide below'}</div></div><div className="ai-hero-art"><div className="ai-art-orbit orbit-a"/><div className="ai-art-orbit orbit-b"/><div className="ai-art-core"><Brain size={39}/></div><span>✦</span></div></div>
    <div className="ai-overview-grid">
      <div className="ai-stat"><span className="ai-stat-icon"><ListTodo size={18}/></span><div><small>Pending tasks</small><strong>{pending}</strong></div></div>
      <div className="ai-stat"><span className="ai-stat-icon mint"><Wallet size={18}/></span><div><small>Recorded expenses</small><strong>{money(spent)}</strong></div></div>
      <div className="ai-stat"><span className="ai-stat-icon peach"><Target size={18}/></span><div><small>Focus minutes</small><strong>{focusMinutes}</strong></div></div>
    </div>
    <div className="ai-layout">
      <section className="panel ai-chat-panel">
        <div className="panel-heading ai-chat-heading"><div className="ai-heading-icon"><Sparkles size={18}/></div><div><h3>Ask FocusFlow AI</h3><p>Study help grounded in your task list and dashboard stats</p></div><span className={`ai-demo-badge ${connected ? 'ai-live-badge' : ''}`}>{connected ? 'GROQ LIVE' : 'SETUP NEEDED'}</span></div>
        <div className="ai-messages" aria-live="polite">{messages.map((message, index) => <div key={index} className={`ai-message ${message.role === 'user' ? 'user-message' : ''}`}><span className="ai-message-icon">{message.role === 'user' ? 'You' : <Sparkles size={15}/>}</span><p>{message.text}</p></div>)}{loading && <div className="ai-message"><span className="ai-message-icon"><Sparkles size={15}/></span><p className="ai-thinking"><LoaderCircle size={15}/> Thinking through your question…</p></div>}</div>
        <form className="ai-input-row" onSubmit={onSubmit}><input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask for a plan, explanation, or task priorities…" aria-label="Ask FocusFlow AI" maxLength={1000} disabled={loading}/><button className="primary-button" type="submit" disabled={loading || !input.trim()}><Send size={16}/> {loading ? 'Thinking' : 'Ask AI'}</button></form>
        <div className="ai-disclaimer">AI responses can be imperfect. Verify important academic information. Your API key stays in the backend .env file—not in browser code.</div>
      </section>
      <aside className="ai-side-column">
        <section className="panel ai-prompts-panel"><div className="panel-heading"><div><h3><Lightbulb size={16}/> Quick prompts</h3><p>Tap one to fill the chat box</p></div></div><div className="ai-prompt-list">{prompts.map(prompt => <button key={prompt} className="ai-prompt" onClick={() => onPrompt(prompt)}>{prompt}<span>↗</span></button>)}</div></section>
        <section className="ai-tip-card"><div className="ai-tip-icon"><Brain size={19}/></div><h3>Study in small sprints</h3><p>Ask AI to break a chapter into 3 manageable parts, then use the focus timer for one part at a time.</p></section>
      </aside>
    </div>
    <section className="panel video-finder-panel"><div className="video-finder-heading"><div className="video-heading-icon"><Youtube size={21}/></div><div><span className="eyebrow">LEARN WITH VISUALS</span><h3>Study video finder</h3><p>Search for topic explainers, tutorials, and revision videos on YouTube.</p></div></div><form className="video-search-form" onSubmit={searchVideos}><input value={videoTopic} onChange={event => setVideoTopic(event.target.value)} placeholder={suggestedTask ? `Suggested: ${suggestedTask.title}` : 'Enter a topic, e.g. React useState'} aria-label="Study topic for video search" maxLength={160}/><button type="submit" className="primary-button" disabled={!topic}><Youtube size={16}/> {videoLoading ? 'Searching…' : 'Find videos'}</button></form>{videoError && <p role="status" className="video-note">{videoError} {!videoResults.length && <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`} target="_blank" rel="noreferrer">Open YouTube search instead ↗</a>}</p>}{videoResults.length > 0 && <div className="video-results-grid">{videoResults.map(video => <a className="video-result-card" key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">{video.thumbnail && <img src={video.thumbnail} alt="" loading="lazy"/>}<strong>{video.title}</strong><span>{video.channel}</span></a>)}</div>}<div className="video-suggestion-row"><span>Suggested from your tasks</span>{suggestedTask ? <button className="video-suggestion" onClick={() => setVideoTopic(suggestedTask.title)}>{suggestedTask.title} <ArrowUpRight size={13}/></button> : <span className="video-muted">Add a Study or College task to see suggestions.</span>}</div><p className="video-note">Searches YouTube Data API for video titles and thumbnails. Review each video for accuracy.</p></section>

  </>
}
function SettingsPage({ theme, setTheme, profileDraft, setProfileDraft, onSaveProfile, onReset }) {
  const themes = [
    { id: 'violet', name: 'Electric violet', colors: ['#7557f6', '#ff9b80', '#ffd16d'], desc: 'The signature FocusFlow look' },
    { id: 'sunset', name: 'Sunset pop', colors: ['#f26f8b', '#ffb15e', '#8057e8'], desc: 'Warm, playful and energetic' },
    { id: 'ocean', name: 'Ocean mint', colors: ['#258eaa', '#64d6bb', '#9b8afb'], desc: 'Fresh blue with mint accents' },
    { id: 'midnight', name: 'Midnight', colors: ['#9b86ff', '#ff9dba', '#70d8bd'], desc: 'A darker, low-glare workspace' },
  ]
  return <>
    <PageHeading eyebrow="MAKE IT YOURS" title="Settings & profile" subtitle="Personalize your workspace, choose a theme, and manage your profile preferences." />
    <div className="settings-welcome"><div className="settings-welcome-icon"><Palette size={25}/></div><div><span>YOUR SPACE, YOUR STYLE</span><h2>A workspace that feels like you.</h2><p>Your preferences are saved locally in this browser.</p></div><div className="settings-sparkle">✦</div></div>
    <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon purple"><Palette size={19}/></span><div><h3>Color themes</h3><p>Pick a look for your dashboard. Changes apply instantly.</p></div></div>
      <div className="theme-grid">{themes.map(item => <button type="button" key={item.id} onClick={() => setTheme(item.id)} className={`theme-option ${theme === item.id ? 'theme-selected' : ''}`} aria-pressed={theme === item.id}><span className={`theme-preview theme-preview-${item.id}`}><i/><i/><i/><b/></span><span className="theme-option-copy"><strong>{item.name}</strong><small>{item.desc}</small></span><span className="theme-radio">{theme === item.id ? <Check size={13}/> : null}</span></button>)}</div>
    </section>
    <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon peach"><UserRound size={19}/></span><div><h3>Profile details</h3><p>Update how your profile appears in FocusFlow.</p></div></div>
      <form className="profile-settings-form" onSubmit={event => { event.preventDefault(); onSaveProfile() }}>
        <div className="profile-preview-row"><div className="profile-big-avatar">{(profileDraft.name || 'F').trim().slice(0,1).toUpperCase()}</div><div><strong>{profileDraft.name || 'Your name'}</strong><span>Personal workspace profile</span></div><span className="local-profile-tag"><ShieldCheck size={13}/> Local profile</span></div>
        <div className="settings-form-grid"><label>Display name<input value={profileDraft.name} onChange={e => setProfileDraft(current => ({...current, name:e.target.value}))} placeholder="Your name" maxLength={60} required /></label><label>Email address<input type="email" value={profileDraft.email} onChange={e => setProfileDraft(current => ({...current, email:e.target.value}))} placeholder="you@example.com" maxLength={120} /></label><label>Phone number<input type="tel" value={profileDraft.phone} onChange={e => setProfileDraft(current => ({...current, phone:e.target.value}))} placeholder="+91 98xxx xxxxx" maxLength={20} /></label><label>Personal study goal<input value={profileDraft.studyGoal} onChange={e => setProfileDraft(current => ({...current, studyGoal:e.target.value}))} placeholder="e.g. Study 45 minutes daily" maxLength={120} /></label></div>
        <div className="profile-notice"><ShieldCheck size={16}/><p><strong>Profile-only mode:</strong> these details are saved on this device. This form does not create an account, verify email/phone, or send OTPs. Real sign-in requires an authentication provider and backend.</p></div>
        <div className="settings-actions"><button type="button" className="secondary-button" onClick={onReset}><RotateCcw size={15}/> Reset preferences</button><button className="primary-button" type="submit"><Save size={16}/> Save profile</button></div>
      </form>
    </section>
    <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon mint"><ShieldCheck size={19}/></span><div><h3>AI & integrations</h3><p>Connection setup for chat prompts and study videos.</p></div></div><div className="integration-list"><div className="integration-row"><span className="integration-logo ai-logo"><Brain size={18}/></span><div><strong>AI chat prompts</strong><small>Groq API key is configured on the backend through <code>.env</code>.</small></div><a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">Get API key ↗</a></div><div className="integration-row"><span className="integration-logo yt-logo"><Youtube size={18}/></span><div><strong>YouTube study search</strong><small>Search links work without a key. YouTube Data API key enables in-app video titles and thumbnails.</small></div><a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">Google Cloud ↗</a></div></div><p className="integration-footnote">Never paste secret API keys into this settings page or React code. Keep them in the backend environment file.</p></section>
  </>
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}
function StatCard({ label, value, sub, icon: Icon, tone, trend }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={19} /></span></div><div className="stat-value">{value}</div><div className="stat-sub">{trend && <span className="trend"><ArrowUpRight size={14} /></span>}{sub}</div></div>
}
function Overview({ tasks, completedCount, openCount, focusMinutes, spent, remaining, budget, progress, expenses, chartData, universe, onNavigate, onAddTask, onAddExpense, onToggleTask }) {
  const recentTasks = tasks.filter(task => !task.done).slice(0, 4)
  return <>
    <PageHeading eyebrow="YOUR PERSONAL SPACE" title="Good things take focus." subtitle="A calmer way to plan your day, one step at a time." action={<button className="primary-button" onClick={onAddTask}><Plus size={17} /> New task</button>} />
    <div className="welcome-banner"><div className="welcome-copy"><div className="welcome-pill"><Sparkles size={13} /> YOUR DAILY CHECK-IN</div><h2>Make today count.</h2><p>Choose what matters most, then give it your attention.</p><button className="banner-button" onClick={() => onNavigate('focus')}>Start a focus session <ArrowUpRight size={16} /></button></div><div className="banner-art" aria-hidden="true"><div className="art-sun" /><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-plant">✳</div><div className="art-orb"><Target size={43} /></div><div className="art-spark spark-a">✦</div><div className="art-spark spark-b">✧</div></div></div>
    <div className="section-heading"><div><h2>Your overview</h2><p>A snapshot of your progress so far.</p></div><span className="live-label"><span /> UPDATED LIVE</span></div>
    <div className="stats-grid">
      <StatCard label="Tasks completed" value={`${completedCount}/${tasks.length}`} sub={`${openCount} left to do`} icon={CheckCircle2} tone="purple" />
      <StatCard label="Focus time" value={`${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`} sub="Completed sessions" icon={Clock3} tone="blue" />
      <StatCard label="Total spending" value={money(spent)} sub="Recorded expenses" icon={CreditCard} tone="peach" />
      <StatCard label="Budget remaining" value={money(remaining)} sub={`${Math.round(progress)}% of budget used`} icon={Wallet} tone="green" />
    </div>
    <section className="panel universe-panel"><div className="universe-heading"><div className="universe-emblem">✦</div><div><span className="universe-eyebrow">YOUR FOCUS UNIVERSE</span><h3>Your effort creates a universe.</h3><p>Finish a timer session to earn a star. Every focus minute earns 1 point.</p></div></div><div className="universe-metrics"><div><span className="universe-star">★</span><strong>{universe.stars}</strong><small>Stars earned</small></div><div><span className="universe-point">✧</span><strong>{universe.points}</strong><small>Focus points</small></div><div><span className="universe-planet">◉</span><strong>{Math.floor(universe.points / 10)}</strong><small>Planets unlocked</small></div></div><div className="planet-progress"><div><span>Next planet</span><strong>{universe.points % 10}/10 points</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${(universe.points % 10) * 10}%` }} /></div><p>{10 - (universe.points % 10)} more focus points to unlock your next planet.</p></div><div className="universe-sky" aria-label={`${universe.stars} stars and ${Math.floor(universe.points / 10)} planets unlocked`}><span>✦</span><span>✧</span><span>·</span><span>★</span><span>✦</span>{Array.from({ length: Math.min(5, Math.floor(universe.points / 10)) }, (_, i) => <i key={i} className={`universe-orb orb-${i + 1}`} />)}</div></section>
    <div className="content-grid">
      <section className="panel tasks-panel"><div className="panel-heading"><div><h3>Up next</h3><p>Your next small wins</p></div><button className="text-button" onClick={() => onNavigate('tasks')}>View all <ArrowUpRight size={15} /></button></div>
        {recentTasks.length ? <div className="task-list">{recentTasks.map(task => <TaskRow key={task.id} task={task} onToggle={onToggleTask} />)}</div> : <EmptyState icon={CheckCircle2} title="All caught up!" text="Add a task when you're ready for the next one." />}
        <button className="add-inline" onClick={onAddTask}><Plus size={16} /> Add another task</button>
      </section>
      <section className="panel spending-panel"><div className="panel-heading"><div><h3>Spending snapshot</h3><p>Your last 7 days</p></div><button className="round-arrow" aria-label="Open expenses" onClick={() => onNavigate('expenses')}><ArrowUpRight size={17} /></button></div>
        <div className="chart-total"><div><span>Recorded total</span><strong>{money(spent)}</strong></div><span className="chart-legend"><i /> Spending</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 3, left: -24, bottom: 0 }}><defs><linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b7cf6" stopOpacity={0.25} /><stop offset="100%" stopColor="#8b7cf6" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#f0edf8" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9a96ad', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9a96ad', fontSize: 10 }} /><Tooltip formatter={value => [money(value), 'Spent']} contentStyle={{ borderRadius: 12, border: '1px solid #efecf7', fontSize: 12 }} /><Area type="monotone" dataKey="amount" stroke="#8878f5" strokeWidth={2.5} fill="url(#spendFill)" activeDot={{ r: 4, fill: '#8878f5' }} /></AreaChart></ResponsiveContainer></div>
        <div className="budget-mini"><div className="budget-label"><span>Monthly budget</span><strong>{money(spent)} <em>of</em> {money(budget)}</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><button className="text-button budget-link" onClick={() => onNavigate('expenses')}>Manage budget <ArrowUpRight size={14} /></button></div>
      </section>
    </div>
    <section className="bottom-cta"><div className="cta-icon"><TimerReset size={21} /></div><div><strong>Protect a little time for yourself.</strong><p>Even 25 minutes of focus can move a task forward.</p></div><button className="secondary-button" onClick={() => onNavigate('focus')}>Open focus timer <ArrowUpRight size={16} /></button></section>
  </>
}
function MissionsPage({ missions, onToggle, onNavigate }) {
  const completed = missions.filter(mission => mission.done).length
  const earned = missions.filter(mission => mission.done).reduce((sum, mission) => sum + mission.points, 0)
  const total = missions.reduce((sum, mission) => sum + mission.points, 0)
  const missionIcon = { plan: CalendarCheck, focus: TimerReset, learn: BookOpen, review: Sparkles }
  return <>
    <PageHeading eyebrow="SMALL STEPS, REAL MOMENTUM" title="Your daily missions" subtitle="A flexible set of tiny wins to help you study with intention — no perfection required." action={<span className="mission-points-pill"><Trophy size={16}/> {earned} XP earned</span>} />
    <section className="mission-hero"><div className="mission-hero-copy"><span className="mission-eyebrow"><Sparkles size={13}/> TODAY'S QUEST</span><h2>Make progress feel rewarding.</h2><p>Finish a few small missions and build a study rhythm that works for you.</p><div className="mission-progress-meta"><span>{completed} of {missions.length} missions complete</span><strong>{Math.round(completed / Math.max(missions.length, 1) * 100)}%</strong></div><div className="mission-progress-track"><span style={{width:`${completed / Math.max(missions.length, 1) * 100}%`}}/></div></div><div className="mission-hero-art"><div className="mission-orbit orbit-a"/><div className="mission-orbit orbit-b"/><div className="mission-trophy"><Trophy size={42}/></div><span className="mission-star star-one">✦</span><span className="mission-star star-two">✧</span></div></section>
    <div className="mission-grid">{missions.map((mission, index) => { const Icon = missionIcon[mission.icon] || Sparkles; return <article className={`mission-card ${mission.done ? 'mission-complete' : ''}`} key={mission.id} style={{animationDelay:`${index * 70}ms`}}><div className={`mission-icon mission-icon-${mission.icon}`}><Icon size={21}/></div><div className="mission-card-top"><span className="mission-step">MISSION 0{index + 1}</span><span className="mission-xp">+{mission.points} XP</span></div><h3>{mission.title}</h3><p>{mission.detail}</p><button className={`mission-action ${mission.done ? 'mission-action-done' : ''}`} onClick={() => onToggle(mission.id)}>{mission.done ? <><CheckCircle2 size={16}/> Completed · undo</> : <>Mark complete <ArrowUpRight size={15}/></>}</button></article>})}</div>
    <section className="mission-bottom-row"><div className="mission-tip-card"><div className="mission-tip-icon"><Flame size={20}/></div><div><strong>Consistency beats intensity</strong><p>Even one mission is a win. Your points are saved on this device.</p></div></div><button className="primary-button" onClick={() => onNavigate('focus')}><TimerReset size={16}/> Start a focus session</button><button className="secondary-button" onClick={() => onNavigate('tasks')}><ListTodo size={16}/> View tasks</button></section>
    <p className="mission-disclaimer">XP is a local motivation score, not a real-world reward. Missions can be unchecked if you want to reset your progress.</p>
  </>
}

function TaskRow({ task, onToggle, onDelete }) {
  return <div className={`task-row ${task.done ? 'task-done' : ''}`}><button className={`task-check ${task.done ? 'checked' : ''}`} aria-label={task.done ? 'Mark task incomplete' : 'Complete task'} onClick={() => onToggle(task.id)}>{task.done && <Check size={13} />}</button><div className="task-info"><strong>{task.title}</strong><span>{task.category}</span></div><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>{['Study', 'College'].includes(task.category) && <a className="task-video-link" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(task.title + ' tutorial for students')}`} target="_blank" rel="noreferrer" title="Find study videos on YouTube"><Youtube size={14} /> Videos</a>}{onDelete && <button className="row-delete" aria-label="Delete task" onClick={() => onDelete(task.id)}><Trash2 size={15} /></button>}</div>
}
function TasksPage({ tasks, onAdd, onToggle, onDelete }) {
  const [filter, setFilter] = useState('All')
  const visible = tasks.filter(task => filter === 'All' || (filter === 'Completed' ? task.done : !task.done))
  return <><PageHeading eyebrow="STAY ON TRACK" title="My tasks" subtitle="Turn the things you need to do into things you've done." action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> New task</button>} />
    <div className="task-page-summary"><div><span className="summary-number">{tasks.length}</span><span>Total tasks</span></div><div><span className="summary-number">{tasks.filter(t => t.done).length}</span><span>Completed</span></div><div><span className="summary-number">{tasks.filter(t => !t.done).length}</span><span>Still to do</span></div></div>
    <section className="panel page-panel"><div className="panel-heading"><div><h3>Your list</h3><p>One thing at a time is enough.</p></div><div className="filter-tabs">{['All', 'To do', 'Completed'].map(item => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
      {visible.length ? <div className="task-list task-list-large">{visible.map(task => <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)}</div> : <EmptyState icon={ListTodo} title="Nothing here yet" text="Try another filter or add a new task." />}
    </section>
  </>
}
function LoginPage({ name, setName, email, setEmail, onSubmit, theme }) {
  return <div className="login-screen" data-theme={theme}><div className="login-glow login-glow-one"/><div className="login-glow login-glow-two"/><section className="login-card"><div className="login-brand"><span className="brand-mark"><Sparkles size={21}/></span><span>focusflow<span className="brand-dot">.</span></span></div><div className="login-art"><div className="login-orbit orbit-one"/><div className="login-orbit orbit-two"/><div className="login-art-core"><Target size={38}/></div><span>✦</span><i>✧</i></div><p className="login-eyebrow">YOUR SPACE TO FOCUS</p><h1>Make room for<br/><em>your best work.</em></h1><p className="login-subtitle">A calmer way to plan, focus, and make progress every day.</p><form onSubmit={onSubmit} className="login-form"><label>Your name<input value={name} onChange={event => setName(event.target.value)} placeholder="What should we call you?" maxLength={60}/></label><label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required/></label><button className="primary-button full-button" type="submit">Continue to FocusFlow <ArrowUpRight size={17}/></button></form><p className="login-disclaimer"><ShieldCheck size={14}/> This starter sign-in saves a local session on this device. It is not secure account authentication.</p></section><div className="login-footer">SMALL STEPS. DEEP FOCUS. REAL PROGRESS.</div></div>
}
function playCompletionSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const now = context.currentTime
    ;[0, 0.22, 0.44].forEach((offset, index) => {
      const oscillator = context.createOscillator(); const gain = context.createGain()
      oscillator.type = 'sine'; oscillator.frequency.value = [660, 784, 988][index]
      gain.gain.setValueAtTime(0.0001, now + offset); gain.gain.exponentialRampToValueAtTime(0.16, now + offset + 0.025); gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2)
      oscillator.connect(gain); gain.connect(context.destination); oscillator.start(now + offset); oscillator.stop(now + offset + 0.22)
    })
    window.setTimeout(() => context.close().catch(() => {}), 1200)
  } catch (error) { console.warn('Completion sound could not play in this browser.', error) }
}

function FocusPage({ timerDisplay, timerRunning, timerMinutes, secondsLeft, timerSeconds, onDuration, onToggle, onReset, focusMinutes, universe }) {
  const circumference = 2 * Math.PI * 92
  const totalSeconds = timerMinutes * 60 + timerSeconds
  const progress = totalSeconds ? secondsLeft / totalSeconds : 0
  const [customMinutes, setCustomMinutes] = useState(String(timerMinutes))
  const [customSeconds, setCustomSeconds] = useState(String(timerSeconds))
  return <><PageHeading eyebrow="MAKE SPACE TO THINK" title="Focus timer" subtitle="One task. One session. Fewer distractions." />
    <div className="focus-layout"><section className="panel timer-panel"><div className="timer-topline"><span className="timer-status"><span className={timerRunning ? 'pulse-dot' : ''} />{timerRunning ? 'SESSION IN PROGRESS' : 'YOUR FOCUS SPACE'}</span><span className="session-tag"><Zap size={13} /> Pomodoro</span></div>
      <div className="timer-circle"><svg viewBox="0 0 220 220" aria-hidden="true"><circle className="timer-track" cx="110" cy="110" r="92" /><circle className="timer-progress" cx="110" cy="110" r="92" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} /></svg><div className="timer-center"><span className="timer-caption">{secondsLeft === 0 ? 'SESSION DONE' : timerRunning ? 'STAY IN THE MOMENT' : 'READY WHEN YOU ARE'}</span><strong>{timerDisplay}</strong><span className="timer-subcaption">{timerMinutes > 0 ? `${timerMinutes} min` : ''}{timerMinutes > 0 && timerSeconds > 0 ? ' ' : ''}{timerSeconds > 0 ? `${timerSeconds} sec` : ''} session</span></div></div>
      <div className="duration-picker"><span>Quick presets</span><div>{[15, 25, 45].map(minutes => <button key={minutes} className={timerMinutes === minutes && timerSeconds === 0 ? 'duration-active' : ''} onClick={() => { setCustomMinutes(String(minutes)); setCustomSeconds('0'); onDuration(minutes, 0) }}>{minutes} min</button>)}</div></div>
      <form className="custom-timer-form" onSubmit={event => { event.preventDefault(); const m = Math.max(0, Math.min(180, Number(customMinutes) || 0)); const sec = Math.max(0, Math.min(59, Number(customSeconds) || 0)); if (m || sec) onDuration(m, sec) }}><span>Custom duration</span><div><label>Minutes<input aria-label="Custom timer minutes" type="number" min="0" max="180" value={customMinutes} onChange={e => setCustomMinutes(e.target.value)} /></label><label>Seconds<input aria-label="Custom timer seconds" type="number" min="0" max="59" value={customSeconds} onChange={e => setCustomSeconds(e.target.value)} /></label><button className="secondary-button" type="submit">Set timer</button></div></form>
      <div className="timer-actions"><button className="primary-button timer-start" onClick={onToggle}>{timerRunning ? 'Pause session' : secondsLeft === 0 ? 'Start again' : 'Start focusing'} <ArrowUpRight size={16} /></button><button className="icon-button reset-button" aria-label="Reset timer" onClick={onReset}><TimerReset size={18} /></button></div><p className="timer-note">Tip: choose one small task before you begin.</p>
    </section><aside className="focus-side"><div className="focus-quote"><div className="quote-mark">“</div><h3>Focus on progress, not perfection.</h3><p>You don't have to do everything. Just the next thing.</p><span>— YOUR DAILY REMINDER</span><div className="quote-stars">✦　✧　✦</div></div><div className="panel focus-stats"><div className="focus-stat-icon"><Clock3 size={18} /></div><div><span>Total focus time</span><strong>{Math.floor(focusMinutes / 60)}h {focusMinutes % 60}m</strong><p>Minutes from completed sessions</p></div></div><div className="panel focus-universe-mini"><div className="universe-mini-icon">🌌</div><div><strong>Your Focus Universe</strong><p>★ {universe.stars} stars · ✧ {universe.points} points</p><small>{Math.floor(universe.points / 10)} planet{Math.floor(universe.points / 10) === 1 ? '' : 's'} unlocked</small></div></div><div className="focus-mini-tip"><Sparkles size={17} /><p><strong>Make it easier:</strong> silence notifications and keep only the materials you need nearby.</p></div></aside></div>
  </>
}
function ExpensesPage({ expenses, spent, budget, remaining, progress, budgetDraft, setBudgetDraft, onBudgetSave, onAdd, onDelete }) {
  const categories = ['Food', 'Travel', 'Study', 'Shopping', 'Other']
  return <><PageHeading eyebrow="MONEY WITH INTENTION" title="Expense tracker" subtitle="See where your money goes, without the guesswork." action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> Add expense</button>} />
    <div className="expense-stats"><div className="expense-stat"><span className="expense-stat-icon peach"><ArrowDownRight size={19} /></span><span>Total spent</span><strong>{money(spent)}</strong><small>Across {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}</small></div><div className="expense-stat"><span className="expense-stat-icon green"><Wallet size={19} /></span><span>Budget remaining</span><strong>{money(remaining)}</strong><small>{Math.round(progress)}% of monthly budget used</small></div></div>
    <div className="expense-layout"><section className="panel page-panel expense-list-panel"><div className="panel-heading"><div><h3>Recent expenses</h3><p>Your spending, all in one place.</p></div><span className="expense-count">{expenses.length} entries</span></div>
      {expenses.length ? <div className="expense-list">{[...expenses].sort((a,b) => b.date.localeCompare(a.date) || b.id-a.id).map(expense => <div className="expense-row" key={expense.id}><div className={`expense-symbol ${expense.category.toLowerCase()}`}>{expense.category === 'Food' ? '☕' : expense.category === 'Travel' ? '↗' : expense.category === 'Study' ? '✎' : expense.category === 'Shopping' ? '◇' : '•'}</div><div className="expense-info"><strong>{expense.title}</strong><span>{expense.category} · {shortDate(expense.date)}</span></div><strong className="expense-amount">−{money(expense.amount)}</strong><button className="row-delete" aria-label={`Delete ${expense.title}`} onClick={() => onDelete(expense.id)}><Trash2 size={15} /></button></div>)}</div> : <EmptyState icon={Wallet} title="No expenses yet" text="Add your first expense to start tracking." />}
    </section><aside className="expense-side"><section className="panel budget-panel"><div className="panel-heading"><div><h3>Monthly budget</h3><p>Give your money a plan.</p></div><div className="budget-icon"><DollarSign size={17} /></div></div><div className="budget-big">{money(budget)}</div><div className="budget-label"><span>{money(spent)} spent</span><strong>{money(remaining)} left</strong></div><div className="progress-track thick"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><p className="budget-help">{spent > budget ? 'You are over your budget. Review your recent expenses.' : `You have ${Math.round(100-progress)}% of your budget left.`}</p><form className="budget-form" onSubmit={e => { e.preventDefault(); onBudgetSave() }}><label htmlFor="budget-input">Update budget (₹)</label><div><input id="budget-input" type="number" min="1" value={budgetDraft} onChange={e => setBudgetDraft(e.target.value)} required /><button className="secondary-button" type="submit">Save</button></div></form></section>
      <section className="panel category-panel"><div className="panel-heading"><div><h3>Categories</h3><p>Spending breakdown</p></div></div>{categories.map(category => { const amount = expenses.filter(e => e.category === category).reduce((sum,e) => sum+Number(e.amount),0); const percent = spent ? amount/spent*100 : 0; return <div className="category-line" key={category}><div><span>{category}</span><strong>{money(amount)}</strong></div><div className="progress-track"><div className="category-fill" style={{ width: `${percent}%` }} /></div></div> })}</section></aside></div>
  </>
}
function Modal({ title, onClose, children }) {
  useEffect(() => { function onKey(event) { if (event.key === 'Escape') onClose() } window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [onClose])
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}><section className="modal-card" role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div>{children}</section></div>
}
function EmptyState({ icon: Icon, title, text }) { return <div className="empty-state"><span><Icon size={22} /></span><strong>{title}</strong><p>{text}</p></div> }
