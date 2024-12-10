<script>
    import Modal from './Modal.svelte';
    import TaskForm from './TaskForm.svelte';
  
    let {
        handleCreateTask,
        isOpen,
        close
	} = $props();
  
    let initialData = $state({ title: '', description: '', priority: 'low', dueDate: new Date(), completed: false });

    $effect(() => {
        if (isOpen) {
            initialData = { title: '', description: '', priority: 'low', dueDate: new Date(), completed: false };
        }
    });
  
    function handleSubmitForm(newTask) {
        handleCreateTask(newTask)
        close();
    }
</script>
  
<Modal {isOpen} close={close}>
    <h2 class="text-xl mb-4">Create New Task</h2>
    <TaskForm handleSubmitForm={handleSubmitForm} {initialData} />
</Modal>
