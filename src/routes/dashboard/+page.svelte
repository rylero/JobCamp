<script lang="ts">
    import CreateNewPositionScreen from "$lib/components/new_position/CreateNewPositionScreen.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { CirclePlus } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();

    let createPositionOpen = $state(data.positionCreateOpen);
</script>

<Navbar />

<div class="h-24"></div>

{#if !createPositionOpen}

<h1>Positions</h1>
<Button onclick={() => createPositionOpen = true}><CirclePlus size={48} /> Create New Position</Button>

{:else}

<CreateNewPositionScreen formHandler={data.form} closeScreen={() => createPositionOpen = false} />

{/if}