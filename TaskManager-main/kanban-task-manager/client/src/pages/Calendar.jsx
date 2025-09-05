import { useEffect, useMemo, useState } from 'react'
import { boardsAPI, tasksAPI } from '../api/client'
import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isSameWeek, startOfMonth, startOfWeek } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

function Calendar() {
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // 'month' | 'week'
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    loadAllTasks()
  }, [])

  const loadAllTasks = async () => {
    try {
      setLoading(true)
      const boardsRes = await boardsAPI.getAll()
      const boards = boardsRes.data
      const all = []
      for (const b of boards) {
        const details = await boardsAPI.getById(b._id)
        const { tasks: boardTasks } = details.data
        boardTasks.forEach(t => all.push({ ...t, boardTitle: b.title }))
      }
      setTasks(all)
    } catch (e) {
      console.error('Calendar: failed to load tasks', e)
    } finally {
      setLoading(false)
    }
  }

  const range = useMemo(() => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })
      const days = []
      let d = start
      while (d <= end) { days.push(d); d = addDays(d, 1) }
      return days
    }
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    const days = []
    let d = start
    while (d <= end) { days.push(d); d = addDays(d, 1) }
    return days
  }, [currentDate, view])

  const tasksByDay = useMemo(() => {
    const map = new Map()
    for (const day of range) map.set(format(day, 'yyyy-MM-dd'), [])
    for (const t of tasks) {
      if (!t.dueDate) continue
      const key = format(new Date(t.dueDate), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(t)
    }
    return map
  }, [tasks, range])

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/taskId', taskId)
  }

  const onDayDrop = async (e, day) => {
    const taskId = e.dataTransfer.getData('text/taskId')
    if (!taskId) return
    const newDateIso = new Date(day).toISOString()
    try {
      await tasksAPI.update(taskId, { dueDate: newDateIso })
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, dueDate: newDateIso } : t))
    } catch (err) {
      console.error('Failed to reschedule task', err)
    }
  }

  const goPrev = () => {
    setCurrentDate(d => view === 'week' ? addDays(d, -7) : addDays(d, -30))
  }
  const goNext = () => {
    setCurrentDate(d => view === 'week' ? addDays(d, 7) : addDays(d, 30))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarIcon size={20} />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{format(currentDate, view === 'week' ? 'MMM d, yyyy' : 'MMMM yyyy')}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date())}>Today</button>
          <button className="btn btn-secondary" onClick={goPrev}><ChevronLeft size={16} /></button>
          <button className="btn btn-secondary" onClick={goNext}><ChevronRight size={16} /></button>
          <select value={view} onChange={(e) => setView(e.target.value)} className="input">
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading calendar...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} style={{ fontSize: 12, color: '#64748b', padding: '4px 6px' }}>{d}</div>
          ))}
          {range.map((day, idx) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayTasks = tasksByDay.get(key) || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isInWeek = isSameWeek(day, currentDate, { weekStartsOn: 1 })
            const muted = view === 'week' ? !isInWeek : !isCurrentMonth
            return (
              <div
                key={idx}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDayDrop(e, day)}
                style={{
                  minHeight: 120,
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 8,
                  background: muted ? '#fafafa' : 'white',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 12, color: isToday ? '#2563eb' : '#6b7280', fontWeight: isToday ? 700 : 500 }}>
                  {format(day, 'd')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dayTasks.map(t => (
                    <div
                      key={t._id}
                      draggable
                      onDragStart={(e) => onDragStart(e, t._id)}
                      title={`Drag to reschedule\n${t.title} (${t.boardTitle})`}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid #e5e7eb',
                        background: '#f1f5f9',
                        fontSize: 12,
                        cursor: 'grab'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{t.title}</div>
                      <div style={{ color: '#64748b' }}>{t.boardTitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Calendar


