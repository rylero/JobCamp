<script lang="ts">
    import CreateNewPositionScreen from "$lib/components/dashboard/CreateNewPositionScreen.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    let { data } = $props();

    let userAndHostInfo = $derived(data.userAndHostInfo)
</script>

<Navbar />

<div class="h-24"></div>

<CreateNewPositionScreen userData={{ name: userAndHostInfo.host.name, email: userAndHostInfo.email }} />

<div class="h-2"></div>