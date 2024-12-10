<script lang="ts">
	import { onMount } from 'svelte'
	import type { TaskObject } from '$lib/interfaces'
	import { actions } from 'astro:actions'

	let {
		handleSubmitForm,
		initialData
	}: { handleSubmitForm: (prop: TaskObject) => void; initialData: TaskObject } = $props()

	let title = $state<string>(initialData?.title || '')
	let description = $state<string>(initialData?.description || '')
	let priority = $state<string>(initialData?.priority || 'low')
	let dueDate = $state<string>(typeof initialData?.dueDate === 'string' ? initialData.dueDate : new Date().toISOString().split('T')[0])
	let completed = $state<boolean>(initialData?.completed || false)

	$effect(() => {
		title = initialData?.title || ''
		description = initialData?.description || ''
		priority = initialData?.priority || 'low'
		dueDate = typeof initialData?.dueDate === 'string' ? initialData.dueDate : new Date(initialData?.dueDate).toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
		completed = initialData?.completed || false
	})

	let minDate = $state<string>('')

	onMount(() => {
		const today = new Date()
		const yyyy = today.getFullYear()
		const mm = String(today.getMonth() + 1).padStart(2, '0')
		const dd = String(today.getDate()).padStart(2, '0')

		minDate = `${yyyy}-${mm}-${dd}`
	})

	async function generateDescription() {
		try {
			const response = await actions.generateDescription({ title })
			if (response.data) {
				description = response.data.description
			} else {
				console.error('Ошибка при генерации описания:', response.error)
			}
		} catch (error) {
			console.error('Ошибка сети:', error)
		}
	}

	function handleSubmit(event: { preventDefault: () => void }) {
		event.preventDefault()
		const task = {
			title: title,
			description: description,
			priority: priority,
			dueDate: new Date(dueDate),
			completed: completed
		}
		handleSubmitForm(task)
	}
</script>

<form on:submit={handleSubmit} class="space-y-6">
	<label class="block">
		<span class="block text-sm font-medium text-gray-700">Title</span>
		<input
			type="text"
			bind:value={title}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
		/>
	</label>
	<label class="block">
		<span class="block text-sm font-medium text-gray-700">Description</span>
		<textarea
			bind:value={description}
			class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
		></textarea>
		<button
		type="button"
		on:click={generateDescription}
		disabled={!title}
		class="mt-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
		  {title ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'}"
	  >
		Generate Description
	  </button>
	</label>
	<label class="block">
		<span class="block text-sm font-medium text-gray-700">Priority</span>
		<select
			bind:value={priority}
			class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
		>
			<option value="low">Low</option>
			<option value="medium">Medium</option>
			<option value="high">High</option>
		</select>
	</label>
	<label class="block">
		<span class="block text-sm font-medium text-gray-700">Due Date</span>
		<input
			type="date"
			bind:value={dueDate}
			min={minDate}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
		/>
	</label>
	<label class="flex">
		<span class="block text-sm font-medium text-gray-700">Completed</span>
		<input
			type="checkbox"
			bind:checked={completed}
			class="ml-3 mt-1 block rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
		/>
	</label>
	<button
		type="submit"
		class="mt-4 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
	>
		Save Task
	</button>
</form>
