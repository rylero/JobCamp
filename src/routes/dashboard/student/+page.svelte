<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import * as Accordion from "$lib/components/ui/accordion/index.js";
    import { ArrowBigDown, ArrowBigUp, Trash2Icon } from "lucide-svelte";
    import { dates } from "./important-dates.json";

    let { data } = $props();

    let positions = $state({ posList: data.positions });
    let leftWidth = $derived(positions.posList.length == 0 ? " w-72" : " min-w-[32rem] w-full");


    const deletePosition = async (posID: string) => {
        positions.posList = positions.posList.filter((val) => val.id != posID);

        const fdata = new FormData();
        fdata.append("id", posID);

        await fetch("?/deletePosition", {
            method: "post",
            body: fdata
        });
    }

    const moveUp = async (posID: string) => {
        let posRankIndex = 0;
        for (let i = 0; i < positions.posList.length; i++) {
            if (positions.posList[i].id == posID) {
                posRankIndex = i;
            }
        }

        var temp = positions.posList[posRankIndex + 1];
        positions.posList[posRankIndex + 1] = positions.posList[posRankIndex];
        positions.posList[posRankIndex] = temp;

        const fdata = new FormData();
        fdata.append("id", posID);
        fdata.append("dir", "down");

        await fetch("?/move", {
            method: "post",
            body: fdata
        });
    }

    const moveDown = async (posID: string) => {
        let posRankIndex = 0;
        for (let i = 0; i < positions.posList.length; i++) {
            if (positions.posList[i].id == posID) {
                posRankIndex = i;
            }
        }

        var temp = positions.posList[posRankIndex - 1];
        positions.posList[posRankIndex - 1] = positions.posList[posRankIndex];
        positions.posList[posRankIndex] = temp;

        const fdata = new FormData();
        fdata.append("id", posID);
        fdata.append("dir", "up");

        await fetch("?/move", {
            method: "post",
            body: fdata
        });
    }
</script>

<Navbar loggedIn={true} isHost={false} />

<div class="flex flex-col md:flex-row w-full min-h-screen pt-20">
    <div class={"flex flex-col gap-2 justify-start items-start p-4" + leftWidth}>
        <h1 class="text-2xl pb-4">My Favorite Jobs</h1>
        {#if positions.posList.length != 0}
        <Accordion.Root class="w-full">
            {#each positions.posList as position, i}
                <Accordion.Item value={position.id} class="my-2 relative">
                {#if i != positions.posList.length-1}<ArrowBigDown class={"absolute left-5 hover:cursor-pointer" + ((i == 0) ? " top-12" : " top-20")} size={32} onclick={() => moveUp(position.id)} />{/if}
                {#if i != 0}<ArrowBigUp class="absolute top-12 left-5 hover:cursor-pointer" size={32} onclick={() => moveDown(position.id)} />{/if}
                <Trash2Icon class="absolute left-[20px] top-3 hover:cursor-pointer" onclick={() => deletePosition(position.id)} size={32} />
                <Accordion.Trigger class={"text-xl text-left bg-slate-100 hover:bg-slate-200 rounded-t-sm px-5" + ((i == positions.posList.length-1 || i == 0) ? " h-[90px]" : " h-[120px]")}>
                    <span class="pl-12 pr-2">{position.host?.company?.companyName} - {position.title}</span>
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
    <div class="flex flex-col w-full md:border-l-2 md:border-l-slate-950">
        <h1 class="text-2xl px-4 py-4">Important Dates</h1>
        {#each dates as info}
            <div class="m-2 p-4 rounded-md shadow-xl border-2">
                <h1 class="text-xl mb-2">{ info.date } - { info.title }</h1>
                <p>{ info.description }</p>
            </div>
        {/each}
    </div>
</div>