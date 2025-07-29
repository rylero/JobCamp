<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();
</script>

<Navbar loggedIn={data.loggedIn} isHost={data.isHost} isAdmin={data.isAdmin} />

<div class="h-24"></div>

<div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-8">Visualizations</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Coming Soon</h2>
        <p class="text-gray-600 mb-4">
            This page will contain charts and graphs related to companies, users, and lottery results.
        </p>
        <p class="text-gray-500 text-sm">
            Planned visualizations include:
        </p>
        <ul class="list-disc list-inside text-gray-500 text-sm mt-2 space-y-1">
            <li>Company engagement trends</li>
            <li>Student choice distribution</li>
            <li>Lottery results analysis</li>
            <li>Position popularity charts</li>
            <li>User activity metrics</li>
        </ul>
    </div>
</div> 