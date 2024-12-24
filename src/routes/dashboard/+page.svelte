<script lang="ts">
    import CreateNewPositionScreen from "./createPosition/+page.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { CirclePlus } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();
</script>

<Navbar />

<div class="h-24"></div>

<h1>Positions</h1>

{#each data.positions as position}
<div>
    <h1>{position.title}</h1>
</div>
{/each}

<Button href="/dashboard/createPosition"><CirclePlus size={16} /> Create New Position</Button>