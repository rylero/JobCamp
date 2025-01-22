<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { dates } from "./important-dates.json";


</script>

<Navbar loggedIn={true} isHost={false} />

<div class="flex w-full min-h-screen pt-20">
    <div class="flex flex-col min-w-72 gap-2 justify-start items-start p-4">
    </div>
    <div class="flex flex-col w-full border-l-2 border-l-slate-950">
        {#each dates as info}
            <div class="m-2 p-4 rounded-md shadow-xl border-2">
                <h1 class="text-xl mb-2">{ info.date } - { info.title }</h1>
                <p>{ info.description }</p>
            </div>
        {/each}
    </div>
</div>