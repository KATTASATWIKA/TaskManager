import React, { useState, useEffect } from 'react'
import { Calendar, Flag, Tag, X, Save, Trash2, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

function TaskModal({ task, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    labels: []
  })
  const [newLabel, setNewLabel] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (task) {
      console.log('TaskModal: Task data received:', task)
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        priority: task.priority || 'medium',
        labels: task.labels || []
      })
    }
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const dataToSave = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    }
    
    console.log('Submitting task update:', { taskId: task._id, data: dataToSave })
    
    try {
      await onSave(task._id, dataToSave)
      console.log('Task updated successfully')
      onClose()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await onDelete(task._id)
      onClose()
    }
  }

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()]
      }))
      setNewLabel('')
    }
  }

  const removeLabel = (labelToRemove) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }))
  }

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'urgent': return { color: '#991b1b', bgColor: '#ffc2c7', icon: AlertCircle }
      case 'high': return { color: '#dc2626', bgColor: '#ffa8b0', icon: AlertCircle }
      case 'medium': return { color: '#92400e', bgColor: '#fbe5c8', icon: Flag }
      case 'low': return { color: '#065f46', bgColor: '#b6e5d8', icon: Flag }
      default: return { color: '#475569', bgColor: '#f8fafc', icon: Flag }
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#065f46' },
    { value: 'medium', label: 'Medium', color: '#92400e' },
    { value: 'high', label: 'High', color: '#dc2626' },
    { value: 'urgent', label: 'Urgent', color: '#991b1b' }
  ]

  if (!task) return null

  console.log('TaskModal render - isEditing:', isEditing, 'task:', task._id)

  return (
    <div className="modal-overlay" onClick={isEditing ? undefined : onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '600px',
          animation: 'scaleIn 0.4s ease-out',
          transform: 'scale(0.9)',
          opacity: 0
        }}
        onAnimationEnd={(e) => {
          e.target.style.transform = 'scale(1)'
          e.target.style.opacity = '1'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
            {isEditing ? 'Edit Task' : 'Task Details'}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!isEditing && (
              <button
                onClick={() => {
                  console.log('Edit button clicked, setting isEditing to true')
                  setIsEditing(true)
                }}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={16} />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#64748b',
                borderRadius: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title */}
            <div style={{ animation: 'slideInFromLeft 0.5s ease-out' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                style={{ width: '100%' }}
                required
              />
            </div>

            {/* Description */}
            <div style={{ animation: 'slideInFromLeft 0.5s ease-out 0.1s both' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input"
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                placeholder="Add a description..."
              />
            </div>

            {/* Due Date and Priority */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              animation: 'slideInFromLeft 0.5s ease-out 0.2s both'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Due Date
                </label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#9ca3af' 
                  }} />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="input"
                    style={{ width: '100%', paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="input"
                  style={{ width: '100%' }}
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
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Priority Preview
              </label>
              <div style={{
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: getPriorityConfig(formData.priority).bgColor
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: getPriorityConfig(formData.priority).color
                }}>
                  {React.createElement(getPriorityConfig(formData.priority).icon, { size: 16 })}
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                    {formData.priority} Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Labels
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
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
                    style={{ width: '100%', paddingLeft: '40px' }}
                    placeholder="Add a label..."
                  />
                </div>
                <button
                  type="button"
                  onClick={addLabel}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              {formData.labels.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {formData.labels.map((label, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
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
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} />
                Delete Task
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Priority Badge */}
            {task.priority && task.priority !== 'medium' && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: getPriorityConfig(task.priority).bgColor,
                color: getPriorityConfig(task.priority).color,
                borderRadius: '6px',
                border: `1px solid ${getPriorityConfig(task.priority).color}20`,
                alignSelf: 'flex-start'
              }}>
                {React.createElement(getPriorityConfig(task.priority).icon, { size: 16 })}
                <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                  {task.priority} Priority
                </span>
              </div>
            )}

            {/* Title */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                {task.title}
              </h3>
              {task.description && (
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {task.dueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} color="#64748b" />
                  <span style={{ color: '#64748b' }}>
                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </span>
                </div>
              )}

              {task.labels && task.labels.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <Tag size={16} color="#64748b" />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {task.labels.map((label, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} />
                Delete Task
              </button>

              <button
                onClick={() => {
                  console.log('Edit Task button clicked, setting isEditing to true')
                  setIsEditing(true)
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={16} />
                Edit Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskModal