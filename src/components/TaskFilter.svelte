<script lang="ts">
  let {
    handleFilterChange
  }: {
    handleFilterChange: (event: Event) => void
  } = $props();
</script>

<div class="space-y-4 lg:space-y-0 lg:flex lg:space-x-4">
  <label class="block w-full lg:w-auto">
    <span class="block text-sm font-medium text-gray-700">Filter by Priority</span>
    <select name="priority" on:change={handleFilterChange} class="mt-1 block w-full lg:w-auto pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <option value="">All</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </label>
  <label class="block w-full lg:w-auto">
    <span class="block text-sm font-medium text-gray-700">Filter by Status</span>
    <select name="completed" on:change={handleFilterChange} class="mt-1 block w-full lg:w-auto pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <option value="">All</option>
      <option value="true">Completed</option>
      <option value="false">Active</option>
    </select>
  </label>
</div>
