<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    
    export let data;
    const { isAdmin, loggedIn } = data;
</script>

<Navbar {isAdmin} {loggedIn} />

<div class="w-full mt-28 flex flex-col items-center">
    <div class="max-w-4xl w-full px-4">
        <h1 class="text-3xl font-bold mb-6">Lottery Management</h1>
        
        <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 mb-4">Admin interface for running and viewing the student position lottery.</p>
            <!-- Add your lottery management UI here -->
            <div class="space-y-4">
                <div class="border rounded p-4">
                    <h3 class="font-semibold">Run Lottery</h3>
                    <p class="text-sm text-gray-500">Trigger or re-run the lottery for student placements</p>
                </div>
                <div class="border rounded p-4">
                    <h3 class="font-semibold">View Results</h3>
                    <p class="text-sm text-gray-500">See which students were placed in which positions</p>
                </div>
            </div>
        </div>
    </div>
</div>