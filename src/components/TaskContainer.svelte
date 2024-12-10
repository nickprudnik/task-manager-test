<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { actions } from 'astro:actions';
  
	import TaskList from './TaskList.svelte';
	import TaskFilter from './TaskFilter.svelte';
	import Spinner from './Spinner.svelte';
	import CreateTaskModal from './CreateTaskModal.svelte';
  
	const isLoading = writable(true);
	let tasks = $state([]);
	let filters = $state({ priority: '', completed: '' });
	let isCreateModalOpen = $state(false);
  
	async function loadTasks() {
	  try {
		const response = await actions.fetchAllTasks();
		if (response.data) {
		  tasks = [...tasks, ...(Array.isArray(response.data) ? response.data : [])];
		  isLoading.set(false);
		} else {
		  const error = response.error;
		  console.error('Ошибка при загрузке задач:', error);
		  isLoading.set(false);
		}
	  } catch (error) {
		console.error('Ошибка сети:', error);
		isLoading.set(false);
	  }
	}
  
	onMount(() => {
	  loadTasks();
	});
  
	async function createTask(newTask) {
	  try {
		await actions.createTask(newTask);
		tasks.push(newTask);
	  } catch (error) {
		console.error('Ошибка сети:', error);
	  }
	}
  
	function handleCreateTask(newTask) {
	  createTask(newTask);
	  isCreateModalOpen = false;
	}
  
	async function updateTaskInState(updatedTask) {
	  tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
	  await actions.updateTaskById({ id: updatedTask.id, data: updatedTask });
	}
  
	async function deleteTaskInState(taskId) {
	  await actions.deleteTaskById({ id: taskId });
	  tasks = tasks.filter((task) => task.id !== taskId);
	}
  
	function handleFilterChange(event) {
	  const target = event.target;
	  const { name, value } = target;
	  filters = { ...filters, [name]: value };
	}
  </script>
  
  <div class="flex h-screen w-screen flex-col items-center bg-gray-100">
	{#if $isLoading}
	  <Spinner />
	{:else}
	  <div class="container mx-auto overflow-x-hidden p-4">
		<div class="flex justify-between items-center mb-4">
			<h1 class="my-3 text-4xl font-semibold">Task manager board</h1>
			<button class="bg-green-500 text-white px-4 py-2 rounded" onclick={() => isCreateModalOpen = true}>Create New Task</button>
		</div>
		
		<TaskFilter {filters} handleFilterChange={handleFilterChange} />
		<TaskList {tasks} {filters} editTask={updateTaskInState} deleteTask={deleteTaskInState} />
		<CreateTaskModal isOpen={isCreateModalOpen} handleCreateTask={handleCreateTask} close={() => isCreateModalOpen = false} />
	  </div>
	{/if}
  </div>
