<script lang="ts">
	import TaskModal from './TaskModal.svelte';
	import type {TaskObject, FilterObject} from '../interfaces/index'
  
	let {
	  tasks,
	  filters,
	  editTask,
	  deleteTask
	}: {
	  tasks: TaskObject[];
	  filters: FilterObject;
	  editTask: (param: TaskObject) => void;
	  deleteTask: (id: string | undefined) => void;
	} = $props();
  
	let filteredTasks = $state<TaskObject[]>([]);
	let isModalOpen = $state<boolean>(false);
	let selectedTask = $state<TaskObject>();
  
	function handleEdit(task: TaskObject) {
	  selectedTask = { ...task };
	  isModalOpen = true;
	}
  
	function handleSaveTask(updatedTask: TaskObject) {
	  editTask(updatedTask);
	  isModalOpen = false;
	}
  
	function handleDelete(task: TaskObject) {
	  deleteTask(task.id);
	}

	$effect(() => {
	  filteredTasks = tasks.filter(
		(task) =>
		  (filters.priority ? task.priority === filters.priority : true) &&
		  (filters.completed ? task.completed === (filters.completed === 'true') : true)
	  );
	});
  </script>
  
  <ul class="list-disc pl-5">
	{#each filteredTasks as task}
	  <li class="border-b border-gray-300 p-2">
		<div class="flex items-center justify-between">
		  <div class="{task.completed ? 'completed' : ''}">
			<strong class="block text-lg">{task.title}</strong>
			<p class="text-gray-600">{task.description}</p>
			<p class="text-sm text-gray-400">Priority: {task.priority}</p>
			<p class="text-sm text-gray-400">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
			<p class="text-sm text-gray-400">Completed: {task.completed ? 'Yes' : 'No'}</p>
		  </div>
		  <div class="space-x-2">
			<button onclick={() => handleEdit(task)} class="rounded bg-blue-500 hover:bg-blue-600 text-white px-2 py-1">Edit</button>
			<button onclick={() => handleDelete(task)} class="rounded bg-red-500 hover:bg-red-600 text-white px-2 py-1">Delete</button>
		  </div>
		</div>
	  </li>
	{/each}
  </ul>
  
  <TaskModal {selectedTask} handleSaveTask={handleSaveTask} close={() => (isModalOpen = false)} isOpen={isModalOpen} />
  
  <style>
	.completed {
	  text-decoration: line-through;
	}
  </style>
