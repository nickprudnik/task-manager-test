  <script>
    import { onMount } from 'svelte';
  
    let { isOpen, close } = $props()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        close();
      }
    }
  
    function handleClickOutside(event) {
      if (event.target === event.currentTarget) {
        close();
      }
    }
  
    onMount(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    });
  </script>
  
  <div class={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center ${!isOpen ? 'hidden' : ''}`} onclick={handleClickOutside}>
    <div class="relative bg-white p-6 rounded shadow-lg max-w-lg w-full">
      <button class="absolute top-4 right-4 bg-none border-none text-2xl cursor-pointer text-gray-600 hover:text-gray-700" onclick={close}>×</button>
      <slot></slot>
    </div>
  </div>
  
  