<script lang="ts">
    import CreateNewPositionScreen from "$lib/components/dashboard/CreateNewPositionScreen.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    let { data } = $props();

    let hostAndPositionData = $derived(JSON.stringify(data.hostAndPositionInfo))
</script>

<Navbar />

<div class="h-20"></div>

<CreateNewPositionScreen />