<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import * as Accordion from "$lib/components/ui/accordion/index.js";
    import { dates } from "./important-dates.json";

    let { data } = $props();

    let leftWidth = $derived(data.positions.length == 0 ? " w-72" : " w-full");
</script>

<Navbar loggedIn={true} isHost={false} />

<div class="flex w-full min-h-screen pt-20">
    <div class={"flex flex-col gap-2 justify-start items-start p-4" + leftWidth}>
        <h1 class="text-2xl pb-4">My Favorite Jobs</h1>
        {#if data.positions.length != 0}
        <Accordion.Root class="w-full">
            {#each data.positions as position}
                <Accordion.Item value={position.id} class="my-2">
                <Accordion.Trigger class="text-xl text-left bg-slate-100 hover:bg-slate-200 rounded-t-sm px-5">
                    <span>{position.host?.company?.companyName} - {position.title}</span>
                </Accordion.Trigger>
                <Accordion.Content class="px-5">
                    <p class="mt-1">Career: { position.career }</p><br>
                    <p class="mt-1">Description: { position.host?.company?.companyDescription}</p>
                    <p class="mt-1">URL: {position.host?.company?.companyUrl}</p>
                    <p class=""># of slots for students: { position.slots }</p>
            
                    <hr class="my-2">
            
            <p class=" whitespace-pre-line">
            Address:
            { position.address }
            
            Summary:
            { position.summary }
            
            Instructions For Students:
            { position.instructions }
            
            Attire:
            { position.attire }        
            </p>
            
                    <hr class="my-2">
                    
                    <p class="">Arrival: { position.arrival }</p>
                    <p class="">Start: { position.start }</p>
                    <p class="">End: { position.end }</p>
                </Accordion.Content>
                </Accordion.Item>
            {/each}
        </Accordion.Root>
        {:else}
            <h1 class="text-center">No favorite jobs selected.</h1>
        {/if}
    </div>
    <div class="flex flex-col w-full border-l-2 border-l-slate-950">
        <h1 class="text-2xl px-4 py-4">Important Dates</h1>
        {#each dates as info}
            <div class="m-2 p-4 rounded-md shadow-xl border-2">
                <h1 class="text-xl mb-2">{ info.date } - { info.title }</h1>
                <p>{ info.description }</p>
            </div>
        {/each}
    </div>
</div>