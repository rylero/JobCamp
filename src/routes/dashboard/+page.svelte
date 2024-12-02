<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    let { data } = $props();

    let hostAndPositionData = $derived(JSON.stringify(data.hostAndPositionInfo))
</script>

<Navbar />

{ hostAndPositionData }