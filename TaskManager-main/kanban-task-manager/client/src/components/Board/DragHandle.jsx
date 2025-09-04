import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import TaskCard from './TaskCard'

function DragHandle({ children, task, isDragging, dragHandleProps }) {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [dragElement, setDragElement] = useState(null)

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        setDragPosition({ x: e.clientX, y: e.clientY })
      }

      document.addEventListener('mousemove', handleMouseMove)
      return () => document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging])

  const dragPreview = isDragging ? createPortal(
    <div
      className="drag-preview"
      style={{
        left: dragPosition.x - 150,
        top: dragPosition.y - 20
      }}
    >
      <TaskCard task={task} isDragging={true} />
    </div>,
    document.body
  ) : null

  return (
    <>
      <div {...dragHandleProps} style={{ display: isDragging ? 'none' : 'block' }}>
        {children}
      </div>
      {dragPreview}
    </>
  )
}

export default DragHandle
