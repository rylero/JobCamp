<script lang="ts">
    import Button from "../ui/button/button.svelte";

    const { schoolData, loggedIn } = $props();
</script>

<nav class="w-screen h-20 fixed top-0 left-0 bg-gray-800 flex flex-row justify-between items-center text-white">
    <a href="/{schoolData.webAddr}" class="ml-4 text-2xl">JobCamp | {schoolData.name}</a>
    <div class="flex flex-row gap-4 mr-4">
        <Button href="/host-tips" variant="link" class="text-white text-xl">Host Tips</Button>
        <Button href="/faq" variant="link" class="text-white text-xl">FAQ</Button>
        {#if !loggedIn}
            <Button href="/signup" variant="link" class="text-white text-xl">Sign Up</Button>
            <Button href="/login" variant="link" class="text-white text-xl">Login</Button>
        {:else}
            <Button href="/dashboard" variant="link" class="text-white text-xl">Dashboard</Button>
        {/if}
    </div>
</nav>