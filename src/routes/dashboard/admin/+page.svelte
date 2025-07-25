<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    
    export let data;
    const { isAdmin, loggedIn, isHost} = data;
</script>

<Navbar {isAdmin} {loggedIn} {isHost}/>

<div class="w-full mt-28 flex flex-col items-center">
    <div class="max-w-4xl w-full px-4">
        <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 mb-4">Welcome to the admin dashboard. Use the navigation bar to access admin features.</p>
            <!-- Add admin dashboard widgets or stats here -->
        </div>
    </div>
</div>