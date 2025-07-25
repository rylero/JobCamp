<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    
    export let data;
    const { isAdmin, loggedIn, isHost } = data;
</script>

<Navbar {isAdmin} {loggedIn} {isHost} />

<div class="w-full mt-28 flex flex-col items-center">
    <div class="max-w-4xl w-full px-4">
        <h1 class="text-3xl font-bold mb-6">Edit Data</h1>
        
        <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 mb-4">Admin interface for editing school, user, hostor event data.</p>
            <!-- Add your data editing UI here -->
            <div class="space-y-4">
                <div class="border rounded p-4">
                    <h3 class="font-semibold">Edit School Info</h3>
                    <p class="text-sm text-gray-500">Change school name, domain, etc.</p>
                </div>
                <div class="border rounded p-4">
                    <h3 class="font-semibold">Edit Users</h3>
                    <p class="text-sm text-gray-500">Manage admin, host, and student users</p>
                </div>
            </div>
        </div>
    </div>
</div>