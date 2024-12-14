<script lang="ts">
    import CreateNewPositionScreen from "$lib/components/dashboard/CreateNewPositionScreen.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { CirclePlus } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();

    let createPositionOpen = $state(false);
</script>

<Navbar />

<div class="h-24"></div>

{#if !createPositionOpen}

<h1>Positions</h1>
<Button onclick={() => createPositionOpen = true}><CirclePlus size={48} /> Create New Position</Button>

{:else}

<CreateNewPositionScreen userData={{ name: data.host.name, email: data.user.email }} closeScreen={() => createPositionOpen = false} />

{/if}