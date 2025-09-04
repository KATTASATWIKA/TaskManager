import { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
import DragHandle from './DragHandle'
import { Plus, MoreVertical, Edit3, Trash2, Calendar, Flag, Tag, X, Clock } from 'lucide-react'

function TaskList({ 
  list, 
  tasks, 
  onUpdateList, 
  onDeleteList, 
  onCreateTask, 
  onUpdateTask, 
  onDeleteTask, 
  onOpenTask,
  dragHandleProps 
}) {
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    labels: []
  })
  const [newLabel, setNewLabel] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(list.title)

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskData.title.trim()) return

    const taskData = {
      ...newTaskData,
      dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate).toISOString() : null
    }

    await onCreateTask(list._id, taskData)
    setNewTaskData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      labels: []
    })
    setNewLabel('')
    setShowAddTask(false)
  }

  const handleUpdateTitle = async (e) => {
    e.preventDefault()
    if (!editTitle.trim()) return

    await onUpdateList(list._id, { title: editTitle.trim() })
    setIsEditing(false)
  }

  const handleDeleteList = () => {
    if (confirm('Are you sure you want to delete this list? All tasks will be deleted.')) {
      onDeleteList(list._id)
    }
    setShowMenu(false)
  }

  const addLabel = () => {
    if (newLabel.trim() && !newTaskData.labels.includes(newLabel.trim())) {
      setNewTaskData(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()]
      }))
      setNewLabel('')
    }
  }

  const removeLabel = (labelToRemove) => {
    setNewTaskData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }))
  }

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'urgent': return { color: '#be185d', bgColor: '#fdf2f8' }
      case 'high': return { color: '#dc2626', bgColor: '#fef2f2' }
      case 'medium': return { color: '#a16207', bgColor: '#fefce8' }
      case 'low': return { color: '#0369a1', bgColor: '#f0f9ff' }
      default: return { color: '#64748b', bgColor: '#f8fafc' }
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#0369a1' },
    { value: 'medium', label: 'Medium', color: '#a16207' },
    { value: 'high', label: 'High', color: '#dc2626' },
    { value: 'urgent', label: 'Urgent', color: '#be185d' }
  ]

  // Sort tasks based on the list's taskOrder
  const sortedTasks = tasks.sort((a, b) => {
    const aIndex = list.taskOrder ? list.taskOrder.indexOf(a._id) : -1
    const bIndex = list.taskOrder ? list.taskOrder.indexOf(b._id) : -1
    
    // If task is not in taskOrder, put it at the end
    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    
    return aIndex - bIndex
  })

  // Get list color based on title using new color palette
  const getListColor = (title) => {
    const colors = {
      'To Do': { bg: '#fbe5c8', border: '#f7d4a8', text: '#92400e' },
      'In Progress': { bg: '#8fdde7', border: '#6bc7d1', text: '#1e293b' },
      'Done': { bg: '#b6e5d8', border: '#9dd4c7', text: '#065f46' },
      'Backlog': { bg: '#ffc2c7', border: '#ffa8b0', text: '#991b1b' },
      'Planning': { bg: '#fbe5c8', border: '#f7d4a8', text: '#92400e' },
      'Development': { bg: '#8fdde7', border: '#6bc7d1', text: '#1e293b' },
      'Testing': { bg: '#b6e5d8', border: '#9dd4c7', text: '#065f46' },
      'Review': { bg: '#ffc2c7', border: '#ffa8b0', text: '#991b1b' },
      'Deployment': { bg: '#fbe5c8', border: '#f7d4a8', text: '#92400e' }
    }
    return colors[title] || { bg: '#f8fafc', border: '#e2e8f0', text: '#475569' }
  }

  const listColor = getListColor(list.title)

  return (
    <div 
      style={{
        backgroundColor: listColor.bg,
        borderRadius: '12px',
        padding: '20px',
        minHeight: '400px',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${listColor.border}`,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'slideInFromLeft 0.6s ease-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 12px -2px rgba(0, 0, 0, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* List Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        position: 'relative'
      }}>
        {isEditing ? (
          <form onSubmit={handleUpdateTitle} style={{ flex: 1 }}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input"
              style={{ width: '100%', fontSize: '16px', fontWeight: '600' }}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          </form>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 
              {...dragHandleProps}
              onClick={() => setIsEditing(true)}
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: listColor.text,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                margin: 0
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = `${listColor.border}20`}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {list.title}
            </h3>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: listColor.text,
              backgroundColor: `${listColor.border}20`,
              padding: '2px 6px',
              borderRadius: '10px',
              minWidth: '20px',
              textAlign: 'center'
            }}>
              {sortedTasks.length}
            </span>
          </div>
        )}
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              padding: '4px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#64748b',
              borderRadius: '4px'
            }}
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              minWidth: '120px'
            }}>
              <button
                onClick={() => {
                  setIsEditing(true)
                  setShowMenu(false)
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                <Edit3 size={14} />
                Rename
              </button>
              <button
                onClick={handleDeleteList}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#dc2626'
                }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tasks */}
      <Droppable droppableId={list._id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              minHeight: '100px',
              backgroundColor: snapshot.isDraggingOver ? '#e0f2fe' : 'transparent',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              padding: '4px'
            }}
          >
            {sortedTasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                      marginBottom: '8px'
                    }}
                  >
                    <DragHandle
                      task={task}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                    >
                      <TaskCard
                        task={task}
                        onClick={() => onOpenTask(task)}
                        isDragging={snapshot.isDragging}
                      />
                    </DragHandle>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task */}
      {showAddTask ? (
        <form onSubmit={handleCreateTask} style={{ marginTop: '8px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          {/* Title */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Title *
            </label>
            <input
              type="text"
              value={newTaskData.title}
              onChange={(e) => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              className="input"
              style={{ width: '100%', fontSize: '13px' }}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Description
            </label>
            <textarea
              value={newTaskData.description}
              onChange={(e) => setNewTaskData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description..."
              className="input"
              style={{ width: '100%', minHeight: '50px', resize: 'vertical', fontSize: '13px' }}
            />
          </div>

          {/* Due Date and Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                Due Date
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={12} style={{ 
                  position: 'absolute', 
                  left: '6px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9ca3af' 
                }} />
                <input
                  type="date"
                  value={newTaskData.dueDate}
                  onChange={(e) => setNewTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="input"
                  style={{ width: '100%', paddingLeft: '24px', fontSize: '11px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                Priority
              </label>
              <select
                value={newTaskData.priority}
                onChange={(e) => setNewTaskData(prev => ({ ...prev, priority: e.target.value }))}
                className="input"
                style={{ width: '100%', fontSize: '12px' }}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority Preview */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              backgroundColor: getPriorityConfig(newTaskData.priority).bgColor,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Flag size={12} style={{ color: getPriorityConfig(newTaskData.priority).color }} />
              <span style={{ 
                fontSize: '11px', 
                fontWeight: '500', 
                color: getPriorityConfig(newTaskData.priority).color,
                textTransform: 'capitalize'
              }}>
                {newTaskData.priority} Priority
              </span>
            </div>
          </div>

          {/* Labels */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Labels
            </label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={12} style={{ 
                  position: 'absolute', 
                  left: '6px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9ca3af' 
                }} />
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                  className="input"
                  style={{ width: '100%', paddingLeft: '24px', fontSize: '11px' }}
                  placeholder="Add a label..."
                />
              </div>
              <button
                type="button"
                onClick={addLabel}
                className="btn btn-secondary"
                style={{ fontSize: '10px', padding: '5px 7px' }}
              >
                Add
              </button>
            </div>
            {newTaskData.labels.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {newTaskData.labels.map((label, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '3px 6px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      borderRadius: '3px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 12px', flex: 1 }}>
              Add Task
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowAddTask(false)
                setNewTaskData({
                  title: '',
                  description: '',
                  dueDate: '',
                  priority: 'medium',
                  labels: []
                })
                setNewLabel('')
              }}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 12px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddTask(true)}
          style={{
            marginTop: '8px',
            padding: '8px',
            border: 'none',
            background: 'none',
            color: '#64748b',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            width: '100%',
            justifyContent: 'flex-start'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <Plus size={16} />
          Add a task
        </button>
      )}
    </div>
  )
}

export default TaskList