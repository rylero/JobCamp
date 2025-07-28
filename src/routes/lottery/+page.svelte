<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import LotteryWidget from "$lib/components/admin/LotteryWidget.svelte";
    
    export let data;
    const { isAdmin, loggedIn, isHost } = data;
</script>

<Navbar {isAdmin} {loggedIn} {isHost} />

<div class="w-full mt-28 flex flex-col items-center">
    <div class="max-w-4xl w-full px-4">
        <h1 class="text-3xl font-bold mb-6">Lottery Management</h1>
        <LotteryWidget data={data.lotteryData} />
    </div>
</div>