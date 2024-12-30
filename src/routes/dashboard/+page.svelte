<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { CirclePlus, Edit } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";
    import * as Accordion from "$lib/components/ui/accordion/index.js";

    let { data } = $props();
</script>

<Navbar loggedIn={true} isHost={true} />

<div class="h-24"></div>

<h1 class="mx-10 my-2 text-2xl">Positions</h1>

<Accordion.Root class="w-full sm:max-w-[70%] px-10">
{#each data.positions as position}
  <Accordion.Item value={position.id}>
    <Accordion.Trigger class="text-xl">
        <span>{position.title}</span>
    </Accordion.Trigger>
    <Accordion.Content>
        <p class=" mt-1">Career: { position.career }</p>

        <hr class="my-2">

        <p class="">Address: { position.address }</p>
        <p class=""># of Slots: { position.slots }</p>

        <hr class="my-2">

        <p class="">Summary:<br> { position.summary }</p>
        <p class=""><br>Instructions For Students:<br> { position.instructions }</p>
        <p class=""><br>Attire:<br> { position.attire }</p>

        <hr class="my-2">

        <p class=""><br>Primary Contact Name:<br> { position.contact_name }</p>
        <p class=""><br>Primary Email:<br> { position.contact_email }</p>
        
        <hr class="my-2">
        
        <p class="">Arrival: { position.arrival.toLocaleTimeString() }</p>
        <p class="">Start: { position.start.toLocaleTimeString() }</p>
        <p class="">End: { position.end.toLocaleTimeString() }</p>

        <a href={"/dashboard/editPosition?posId="+position.id}><Edit class="mt-3 z-50" /></a>
    </Accordion.Content>
  </Accordion.Item>
{/each}
</Accordion.Root>

<Button href="/dashboard/createPosition" class="ml-10 mt-5"><CirclePlus size={16} /> Create New Position</Button>