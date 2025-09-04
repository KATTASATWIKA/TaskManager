import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { boardsAPI, listsAPI, tasksAPI } from '../api/client'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import TaskList from '../components/Board/TaskList'
import TaskModal from '../components/TaskModal'
import { Plus, ArrowLeft, MoreVertical, Save, RotateCcw } from 'lucide-react'

function Board() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [lists, setLists] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)


  useEffect(() => {
    if (id) {
      loadBoard()
    }
  }, [id])



  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#991b1b'
      case 'high': return '#dc2626'
      case 'medium': return '#92400e'
      case 'low': return '#065f46'
      default: return '#475569'
    }
  }

  // Auto-save board layout after changes
  useEffect(() => {
    if (hasUnsavedChanges && board) {
      const timeoutId = setTimeout(() => {
        saveBoardLayout()
      }, 1000) // Debounce for 1 second

      return () => clearTimeout(timeoutId)
    }
  }, [hasUnsavedChanges, board])

  const loadBoard = async () => {
    try {
      const response = await boardsAPI.getById(id)
      const { board: boardData, lists: listsData, tasks: tasksData } = response.data
      
      // Clean up task orders immediately before setting state
      const cleanedLists = cleanupTaskOrders(listsData, tasksData)
      
      setBoard(boardData)
      setLists(cleanedLists)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error loading board:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Clean up task orders to remove orphaned task IDs
  const cleanupTaskOrders = (listsData, tasksData) => {
    const taskIds = new Set(tasksData.map(task => task._id))
    
    return listsData.map(list => {
      if (list.taskOrder) {
        const cleanedTaskOrder = list.taskOrder.filter(taskId => taskIds.has(taskId))
        if (cleanedTaskOrder.length !== list.taskOrder.length) {
          console.log(`Cleaned task order for list ${list.title}: removed ${list.taskOrder.length - cleanedTaskOrder.length} orphaned tasks`)
          // Update on server asynchronously
          updateList(list._id, { taskOrder: cleanedTaskOrder })
          return { ...list, taskOrder: cleanedTaskOrder }
        }
      }
      return list
    })
  }

  const saveBoardLayout = async () => {
    if (!board) return
    
    try {
      await boardsAPI.update(id, { listOrder: board.listOrder })
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving board layout:', error)
    }
  }

  const createList = async () => {
    const title = prompt('Enter list title:')
    if (!title) return

    try {
      const response = await boardsAPI.createList(id, title)
      setLists(prev => [...prev, response.data])
      setHasUnsavedChanges(true)
    } catch (error) {
      console.error('Error creating list:', error)
      alert('Failed to create list')
    }
  }

  const addQuickLists = async () => {
    const quickListTemplates = [
      'Backlog',
      'Planning',
      'Development',
      'Testing',
      'Review',
      'Deployment'
    ]

    try {
      for (const title of quickListTemplates) {
        // Check if list already exists
        if (!lists.some(list => list.title === title)) {
          const response = await boardsAPI.createList(id, title)
          setLists(prev => [...prev, response.data])
        }
      }
      setHasUnsavedChanges(true)
    } catch (error) {
      console.error('Error creating quick lists:', error)
      alert('Failed to create quick lists')
    }
  }

  const addDefaultLists = async () => {
    const defaultLists = ['To Do', 'In Progress', 'Done']
    
    try {
      for (const title of defaultLists) {
        // Check if list already exists
        if (!lists.some(list => list.title === title)) {
          const response = await boardsAPI.createList(id, title)
          setLists(prev => [...prev, response.data])
        }
      }
      setHasUnsavedChanges(true)
    } catch (error) {
      console.error('Error creating default lists:', error)
      alert('Failed to create default lists')
    }
  }

  const updateList = async (listId, data) => {
    try {
      const response = await listsAPI.update(listId, data)
      setLists(prev => prev.map(list => 
        list._id === listId ? response.data : list
      ))
    } catch (error) {
      console.error('Error updating list:', error)
    }
  }

  const deleteList = async (listId) => {
    if (!confirm('Are you sure you want to delete this list? All tasks will be deleted.')) {
      return
    }

    try {
      await listsAPI.delete(listId)
      setLists(prev => prev.filter(list => list._id !== listId))
      setTasks(prev => prev.filter(task => task.list !== listId))
      setHasUnsavedChanges(true)
    } catch (error) {
      console.error('Error deleting list:', error)
      alert('Failed to delete list')
    }
  }

  const createTask = async (listId, data) => {
    try {
      console.log('Creating task for list:', listId, 'with data:', data)
      const response = await tasksAPI.create(listId, data)
      console.log('Task created successfully:', response.data)
      
      // Update tasks state first
      setTasks(prev => [...prev, response.data])
      
      // Update list's taskOrder - ensure we're working with current state
      setLists(prev => prev.map(list => {
        if (list._id === listId) {
          const currentTaskOrder = list.taskOrder || []
          const newTaskOrder = [...currentTaskOrder, response.data._id]
          // Also update on server
          updateList(listId, { taskOrder: newTaskOrder })
          return { ...list, taskOrder: newTaskOrder }
        }
        return list
      }))
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task')
    }
  }

  const updateTask = async (taskId, data) => {
    try {
      console.log('Board: Updating task:', { taskId, data })
      const response = await tasksAPI.update(taskId, data)
      console.log('Board: Task update response:', response.data)
      setTasks(prev => prev.map(task => 
        task._id === taskId ? response.data : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId)
      
      // Find the task to get its list ID before deletion
      const task = tasks.find(t => t._id === taskId)
      
      // Remove task from state
      setTasks(prev => prev.filter(task => task._id !== taskId))
      
      // Remove from list's taskOrder
      if (task) {
        setLists(prev => prev.map(list => {
          if (list._id === task.list) {
            const newTaskOrder = (list.taskOrder || []).filter(id => id !== taskId)
            // Update on server
            updateList(task.list, { taskOrder: newTaskOrder })
            return { ...list, taskOrder: newTaskOrder }
          }
          return list
        }))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete task')
    }
  }

  const handleDragEnd = async (result) => {
    console.log("Drag result:", result);
    const { destination, source, draggableId, type } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Critical: Validate that the draggable item still exists
    if (type === 'task') {
      const taskExists = tasks.some(task => task._id === draggableId)
      if (!taskExists) {
        console.error('Attempted to drag non-existent task:', draggableId)
        // Force reload to sync state
        loadBoard()
        return
      }
    } else if (type === 'list') {
      const listExists = lists.some(list => list._id === draggableId)
      if (!listExists) {
        console.error('Attempted to drag non-existent list:', draggableId)
        loadBoard()
        return
      }
    }

    if (type === 'list') {
      // Reorder lists
      const newListOrder = Array.from(board.listOrder || [])
      
      // Double-check the draggable is in the current order
      const currentIndex = newListOrder.indexOf(draggableId)
      if (currentIndex === -1) {
        console.error('List not found in board order:', draggableId)
        return
      }
      
      newListOrder.splice(currentIndex, 1)
      newListOrder.splice(destination.index, 0, draggableId)

      setBoard(prev => ({ ...prev, listOrder: newListOrder }))
      setHasUnsavedChanges(true)
    } else if (type === 'task') {
      // Reorder tasks
      const sourceList = lists.find(list => list._id === source.droppableId)
      const destList = lists.find(list => list._id === destination.droppableId)

      if (!sourceList || !destList) {
        console.error('Source or destination list not found')
        return
      }

      if (source.droppableId === destination.droppableId) {
        // Moving within same list
        const currentTaskOrder = sourceList.taskOrder || []
        const newTaskOrder = Array.from(currentTaskOrder)
        
        // Ensure the draggable task is in the current order
        const dragIndex = newTaskOrder.indexOf(draggableId)
        if (dragIndex === -1) {
          console.warn('Task not found in task order, skipping drag operation')
          return
        }
        
        newTaskOrder.splice(dragIndex, 1)
        newTaskOrder.splice(destination.index, 0, draggableId)
        
        // Update lists state immediately for UI responsiveness
        setLists(prev => prev.map(list => 
          list._id === sourceList._id 
            ? { ...list, taskOrder: newTaskOrder }
            : list
        ))
        
        // Update on server
        updateList(sourceList._id, { taskOrder: newTaskOrder })
      } else {
        // Moving between lists
        const newSourceTaskOrder = Array.from(sourceList.taskOrder || [])
        const newDestTaskOrder = Array.from(destList.taskOrder || [])
        
        // Remove from source (only if it exists there)
        const sourceIndex = newSourceTaskOrder.indexOf(draggableId)
        if (sourceIndex === -1) {
          console.warn('Task not found in source list order, adding to destination only')
        } else {
          newSourceTaskOrder.splice(sourceIndex, 1)
        }
        
        // Add to destination
        newDestTaskOrder.splice(destination.index, 0, draggableId)
        
        // Update lists state immediately for UI responsiveness
        setLists(prev => prev.map(list => {
          if (list._id === sourceList._id) {
            return { ...list, taskOrder: newSourceTaskOrder }
          } else if (list._id === destList._id) {
            return { ...list, taskOrder: newDestTaskOrder }
          }
          return list
        }))
        
        // Update task's list assignment
        setTasks(prev => prev.map(task =>
          task._id === draggableId 
            ? { ...task, list: destination.droppableId }
            : task
        ))
        
        // Update on server
        updateList(sourceList._id, { taskOrder: newSourceTaskOrder })
        updateList(destList._id, { taskOrder: newDestTaskOrder })
        updateTask(draggableId, { list: destination.droppableId })
      }
    }
  }

  const openTaskModal = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const closeTaskModal = () => {
    setSelectedTask(null)
    setShowTaskModal(false)
  }

  const resetBoardLayout = async () => {
    if (!confirm('Reset board layout to default order?')) return
    
    try {
      const defaultOrder = lists.map(list => list._id)
      await boardsAPI.update(id, { listOrder: defaultOrder })
      setBoard(prev => ({ ...prev, listOrder: defaultOrder }))
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error resetting board layout:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!board) {
    return (
      <div style={{ textAlign: 'center', padding: '64px' }}>
        <h2>Board not found</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>
            {board.title}
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {hasUnsavedChanges && (
            <button 
              onClick={saveBoardLayout}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={16} />
              Save Layout
            </button>
          )}
          <button 
            onClick={resetBoardLayout}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={16} />
            Reset Layout
          </button>
          <button 
            onClick={addDefaultLists} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            Default Lists
          </button>
          <button 
            onClick={addQuickLists} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            Quick Lists
          </button>
          <button onClick={createList} className="btn btn-primary">
            <Plus size={16} />
            Add List
          </button>
        </div>
      </div>

      

      {lists.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '2px dashed #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>ðŸ“‹</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            No task lists yet
          </h3>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px' }}>
            Get started by creating your first task list. You can add default lists, quick lists, or create a custom one.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={addDefaultLists} className="btn btn-primary">
              <Plus size={16} />
              Add Default Lists
            </button>
            <button onClick={addQuickLists} className="btn btn-secondary">
              <Plus size={16} />
              Add Quick Lists
            </button>
            <button onClick={createList} className="btn btn-secondary">
              <Plus size={16} />
              Create Custom List
            </button>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  paddingBottom: '16px',
                  minHeight: '400px'
                }}
              >
                {lists
                  .sort((a, b) => {
                    const aIndex = board.listOrder ? board.listOrder.indexOf(a._id) : -1
                    const bIndex = board.listOrder ? board.listOrder.indexOf(b._id) : -1
                    
                    // Handle missing indices
                    if (aIndex === -1 && bIndex === -1) return 0
                    if (aIndex === -1) return 1
                    if (bIndex === -1) return -1
                    
                    return aIndex - bIndex
                  })
                  .map((list, index) => (
                  <Draggable key={list._id} draggableId={list._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          minWidth: '300px',
                          flexShrink: 0
                        }}
                      >
                        <TaskList
                          list={list}
                          tasks={tasks.filter(task => task.list === list._id)}
                          onUpdateList={updateList}
                          onDeleteList={deleteList}
                          onCreateTask={createTask}
                          onUpdateTask={updateTask}
                          onDeleteTask={deleteTask}
                          onOpenTask={openTaskModal}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}



      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          onClose={closeTaskModal}
          onSave={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  )
}

export default Board