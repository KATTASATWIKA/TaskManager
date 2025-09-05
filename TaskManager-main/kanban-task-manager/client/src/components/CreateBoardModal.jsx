import { useState, useEffect } from 'react'
import { X, Plus, Sparkles, Loader } from 'lucide-react'
import { boardsAPI } from '../api/client'

function CreateBoardModal({ open, onClose, onCreate, isDarkMode }) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [aiPrompt, setAiPrompt] = useState('')
	const [isGeneratingAI, setIsGeneratingAI] = useState(false)
	const [generationMode, setGenerationMode] = useState('manual') // 'manual' or 'ai'

	useEffect(() => {
		if (open) {
			setTitle('')
			setDescription('')
			setError('')
			setSubmitting(false)
			setAiPrompt('')
			setIsGeneratingAI(false)
			setGenerationMode('manual')
		}
	}, [open])

	if (!open) return null

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		
		if (generationMode === 'manual') {
			if (!title.trim()) {
				setError('Please enter a board title')
				return
			}
			try {
				setSubmitting(true)
				await onCreate({ title: title.trim(), description: description.trim() || undefined })
				onClose()
			} catch (err) {
				setError(err?.message || 'Failed to create board')
			} finally {
				setSubmitting(false)
			}
		} else {
			// AI generation mode
			if (!aiPrompt.trim()) {
				setError('Please enter a prompt for AI generation')
				return
			}
			try {
				setIsGeneratingAI(true)
				const response = await boardsAPI.generateAI(aiPrompt.trim())
				await onCreate(response.data)
				onClose()
			} catch (err) {
				setError(err?.response?.data?.message || err?.message || 'Failed to generate AI board')
			} finally {
				setIsGeneratingAI(false)
			}
		}
	}

	return (
		<div style={{
			position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
			display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
		}}>
			<div style={{
				width: '100%', maxWidth: 480,
				backgroundColor: isDarkMode ? '#111827' : 'white',
				borderRadius: 12,
				border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
				boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
			}}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}` }}>
					<h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: isDarkMode ? '#f9fafb' : '#111827' }}>Create Board</h3>
					<button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>
						<X size={18} />
					</button>
				</div>
				<form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
					{/* Generation Mode Toggle */}
					<div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
						<button
							type="button"
							onClick={() => setGenerationMode('manual')}
							style={{
								flex: 1,
								padding: '8px 12px',
								borderRadius: 6,
								border: `1px solid ${generationMode === 'manual' ? (isDarkMode ? '#3b82f6' : '#2563eb') : (isDarkMode ? '#4b5563' : '#e5e7eb')}`,
								backgroundColor: generationMode === 'manual' ? (isDarkMode ? '#1e40af' : '#dbeafe') : 'transparent',
								color: generationMode === 'manual' ? (isDarkMode ? '#f9fafb' : '#1e40af') : (isDarkMode ? '#d1d5db' : '#6b7280'),
								cursor: 'pointer',
								fontSize: 12,
								fontWeight: 500
							}}
						>
							Manual
						</button>
						<button
							type="button"
							onClick={() => setGenerationMode('ai')}
							style={{
								flex: 1,
								padding: '8px 12px',
								borderRadius: 6,
								border: `1px solid ${generationMode === 'ai' ? (isDarkMode ? '#3b82f6' : '#2563eb') : (isDarkMode ? '#4b5563' : '#e5e7eb')}`,
								backgroundColor: generationMode === 'ai' ? (isDarkMode ? '#1e40af' : '#dbeafe') : 'transparent',
								color: generationMode === 'ai' ? (isDarkMode ? '#f9fafb' : '#1e40af') : (isDarkMode ? '#d1d5db' : '#6b7280'),
								cursor: 'pointer',
								fontSize: 12,
								fontWeight: 500,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 4
							}}
						>
							<Sparkles size={14} />
							AI Generate
						</button>
					</div>

					{generationMode === 'manual' ? (
						<>
							<label style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#d1d5db' : '#374151' }}>Board Title</label>
							<input
								type="text"
								placeholder="e.g. Product Roadmap"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								style={{
									padding: '10px 12px', borderRadius: 8,
									border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
									backgroundColor: isDarkMode ? '#0b1220' : 'white',
									color: isDarkMode ? '#f9fafb' : '#111827'
								}}
							/>

							<label style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#d1d5db' : '#374151' }}>Description (optional)</label>
							<textarea
								placeholder="A short description to identify the board"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								style={{
									padding: '10px 12px', borderRadius: 8,
									border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
									backgroundColor: isDarkMode ? '#0b1220' : 'white',
									color: isDarkMode ? '#f9fafb' : '#111827',
									resize: 'vertical'
								}}
							/>
						</>
					) : (
						<>
							<label style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#d1d5db' : '#374151' }}>
								AI Prompt
								<span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', fontWeight: 400, marginLeft: 4 }}>
									Describe what kind of board you want to create
								</span>
							</label>
							<textarea
								placeholder="e.g. Create a project management board for launching a new mobile app with development phases, testing, and deployment tasks"
								value={aiPrompt}
								onChange={(e) => setAiPrompt(e.target.value)}
								rows={4}
								style={{
									padding: '10px 12px', borderRadius: 8,
									border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
									backgroundColor: isDarkMode ? '#0b1220' : 'white',
									color: isDarkMode ? '#f9fafb' : '#111827',
									resize: 'vertical'
								}}
							/>
							<div style={{
								backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
								padding: '8px 12px',
								borderRadius: 6,
								fontSize: 11,
								color: isDarkMode ? '#9ca3af' : '#6b7280'
							}}>
								💡 AI will generate lists, tasks, subtasks, priorities, and due dates based on your prompt
							</div>
						</>
					)}

					{error && (
						<div style={{
							backgroundColor: '#fef2f2', color: '#991b1b',
							border: '1px solid #fecaca', borderRadius: 8,
							padding: '8px 12px', fontSize: 12
						}}>
							{error}
						</div>
					)}

					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
						<button type="button" onClick={onClose} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							Cancel
						</button>
						<button 
							type="submit" 
							disabled={submitting || isGeneratingAI} 
							className="btn btn-primary" 
							style={{ 
								display: 'flex', 
								alignItems: 'center', 
								gap: 6,
								opacity: (submitting || isGeneratingAI) ? 0.7 : 1
							}}
						>
							{isGeneratingAI ? (
								<>
									<Loader size={16} className="animate-spin" />
									Generating with AI...
								</>
							) : generationMode === 'ai' ? (
								<>
									<Sparkles size={16} />
									Generate Board
								</>
							) : (
								<>
									<Plus size={16} />
									{submitting ? 'Creating...' : 'Create Board'}
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateBoardModal


