<script lang="ts">
    import Navbar from '$lib/components/navbar/Navbar.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Accordion from "$lib/components/ui/accordion/index.js";

    let { data } = $props();

    let carrerWise = $derived(JSON.stringify(data.positionData));
    let companyWise = $derived(JSON.stringify(data.positionData));

    let selected = $state("career");
    let selectedTerm = $state("");

    let filteredPositions = $derived((() => {
        return data.positionData.filter((value) => {
            if (selected == "career") {
                return value.career == selectedTerm;
            } else {
                return value.host.company?.companyName == selectedTerm;
            }
        })
    })());
</script>

<Navbar isHost={true} loggedIn={true} />

<div class="flex w-full h-screen pt-20">
    <div class="flex flex-col w-64 h-full gap-2 justify-start items-start p-4 border-r-2 border-r-slate-950">
        <h1>Search by...</h1>
        <Button class="w-24" variant={selected == "career" ? "outline" : "default"} onclick={() => selected="career"}>Career</Button>
        <Button class="w-24" variant={selected == "career" ? "default" : "outline"} onclick={() => selected="company"}>Company</Button>
        <hr class="border-t-2 border-t-slate-950 w-full" />
        {#each data.positionData as position}
            {#if selected == "career"}<Button onclick={() => selectedTerm = position.career}>{position.career}</Button>{/if}
            {#if selected == "company" && position.host.company?.companyName != undefined}<Button onclick={() => selectedTerm = position.host.company.companyName}>{position.host.company?.companyName}</Button>{/if}
        {/each}
    </div>
    <div class="flex flex-col w-full h-full">
        <Accordion.Root class="w-full px-10 my-5">
            {#each filteredPositions as position}
              <Accordion.Item value={position.id} class="my-2">
                <Accordion.Trigger class="text-xl bg-slate-100 hover:bg-slate-200 rounded-t-sm px-5">
                    <span>{position.title}</span>
                </Accordion.Trigger>
                <Accordion.Content class="px-5">
                    <p class=" mt-1">Career: { position.career }</p><br>
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
                    
                    <p class="">Arrival: { position.arrival.toLocaleTimeString() }</p>
                    <p class="">Start: { position.start.toLocaleTimeString() }</p>
                    <p class="">End: { position.end.toLocaleTimeString() }</p>
                </Accordion.Content>
              </Accordion.Item>
            {/each}
        </Accordion.Root>
    </div>
</div>