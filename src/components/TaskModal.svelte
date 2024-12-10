<script lang="ts">
	import Modal from './Modal.svelte'
	import TaskForm from './TaskForm.svelte'
	import type { TaskObject } from '$lib/interfaces'

	let {
		handleSaveTask,
		isOpen,
		close,
		selectedTask
	}: {
		handleSaveTask: (prop: TaskObject) => void
		isOpen: boolean
		close: () => void
		selectedTask?: TaskObject
	} = $props()

	let title = $state<string>('')
	let description = $state<string>('')
	let priority = $state<string>('')
	let dueDate = $state<string>('')
	let completed = $state<boolean>(false)

	$effect(() => {
		if (selectedTask) {
			title = selectedTask.title
			description = selectedTask.description
			priority = selectedTask.priority
			dueDate = new Date(selectedTask.dueDate).toISOString().split('T')[0] // Format date as YYYY-MM-DD
			completed = selectedTask.completed
		}
	})

	function handleSave(task: TaskObject) {
		const { title, description, priority, dueDate } = task
		const updatedTask = { ...selectedTask, title, description, priority, dueDate, completed: selectedTask?.completed ?? false }
		handleSaveTask(updatedTask)
		close()
	}

	function closeModal() {
		isOpen = false
		close()
	}
</script>

<Modal {isOpen} close={closeModal}>
	<h2 class="mb-4 text-xl">Edit Task</h2>
	<TaskForm handleSubmitForm={handleSave} initialData={selectedTask ? { ...selectedTask, dueDate: new Date(selectedTask.dueDate).toISOString().split('T')[0] } : { title: '', description: '', priority: '', dueDate: new Date().toISOString().split('T')[0], completed: false }} />
</Modal>
