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

    let terms = $derived((() => {
        let possible: any = {};
        data.positionData.forEach((value) => {
            if (selected == "career") {
                possible[value.career] = 1;
            } else {
                if (!value.host.company) { return -1; }
                possible[value.host.company.companyName] = 1;
            }
        })
        return Object.keys(possible).sort();
    })());

    const selectTerm = (term: string) => {
        if (term == selectedTerm) {
            selectedTerm = "";
            return;
        }
        selectedTerm = term;
    }
</script>

<Navbar isHost={data.isHost} loggedIn={data.loggedIn} />

<div class="flex sm:flex-row flex-col w-full h-screen pt-20">
    <div class="flex flex-col px-4 gap-2 h-full justify-start items-start p-4 border-r-2 border-r-slate-950">
        <h1>Search positions by...</h1>
        <div class="flex justify-center items-center gap-3">
            <Button class="w-24" variant={selected == "career" ? "default" : "outline"} onclick={() => selected="career"}>Career</Button>
            <Button class="w-24" variant={selected == "career" ? "outline" : "default"} onclick={() => selected="company"}>Company</Button>
        </div>
        <hr class="border-t-2 border-t-slate-950 w-full" />
        {#each terms as term}
            <Button class="text-xl sm:text-sm hidden sm:block" variant={selectedTerm == term ? 'default' : 'outline'} onclick={() => {
                selectTerm(term);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>{term}</Button>
            <Button  class="text-xl sm:text-sm sm:hidden" variant={selectedTerm == term ? 'default' : 'outline'} onclick={() => selectTerm(term)}>{term}</Button>
            {#if selectedTerm == term}
            <div class="sm:hidden mx-4 mt-2 w-fit">
                <Accordion.Root type="multiple">
                    {#each filteredPositions as position, index}
                    <Accordion.Item value={position.id} class="my-2">
                        <Accordion.Trigger class="text-xl bg-slate-100 hover:bg-slate-200 rounded-t-sm px-5">
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
            </div>
            {/if}
        {/each}
    </div>
    <div class="hidden sm:flex flex-col w-full h-full">
        {#if selectedTerm == ""}
            <h1 class="text-xl text-center mt-5">Nothing selected. Choose a Company or Career to view positions.</h1>
        {/if}
        <div class="mx-4 mt-2">
            <Accordion.Root type="multiple">
                {#each filteredPositions as position, index}
                <Accordion.Item value={position.id} class="my-2">
                    <Accordion.Trigger class="text-xl bg-slate-100 hover:bg-slate-200 rounded-t-sm px-5" onclick={(event) => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
        </div>
    </div>
</div>