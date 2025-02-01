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
    <div class={"w-full flex flex-col gap-2 justify-start items-center md:m-4" + leftWidth}>
        <h1 class="text-2xl text-center w-full mt-4 md:mt-0">My Favorite Jobs</h1>
        {#if positions.posList.length != 0}
            <Accordion.Root type="multiple"  class="mt-2 w-screen md:w-full px-4">
                {#each positions.posList as position, i}
                    <Accordion.Item value={position.id} class="my-2 relative">
                    <Accordion.Trigger class={"relative text-md md:text-lg text-left bg-slate-100 hover:bg-slate-200 rounded-t-sm px-5 pl-9" + ((i == positions.posList.length-1 || i == 0) ? " min-h-[60px]" : " min-h-[110px]")}>
                        <span class="pl-12 pr-32 text-wrap">{position.host?.company?.companyName} - {position.title}</span>
                    </Accordion.Trigger>
                    {#if i != positions.posList.length-1}<ArrowBigDown class={"absolute left-3 hover:cursor-pointer" + ((i == 0) ? " top-2" : " top-14")} size={48} onclick={() => moveUp(position.id)} />{/if}
                    {#if i != 0}<ArrowBigUp class="absolute top-1.5 left-3 hover:cursor-pointer" size={48} onclick={() => moveDown(position.id)} />{/if}
                    <Trash2Icon class={"absolute right-[60px] hover:cursor-pointer" + ((i == positions.posList.length-1 || i == 0) ? " top-4" : " top-10")} onclick={() => deletePosition(position.id)} size={32} />
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
        <h1 class="text-2xl px-4 py-4 text-center w-full">Important Dates</h1>
        {#each dates as info}
            <div class="m-2 mx-4 p-4 rounded-md shadow-xl border-2">
                <h1 class="text-xl mb-2">{ info.date } - { info.title }</h1>
                <p>{ info.description }</p>
            </div>
        {/each}
    </div>
</div>