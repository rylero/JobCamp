<script lang="ts">
    import CreateNewPositionScreen from "./createPosition/+page.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { CirclePlus } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";
    import * as Accordion from "$lib/components/ui/accordion/index.js";

    let { data } = $props();
</script>

<Navbar />

<div class="h-24"></div>

<h1 class="mx-10 my-2 text-2xl">Positions</h1>

<Accordion.Root class="w-full sm:max-w-[70%] px-10">
{#each data.positions as position}
  <Accordion.Item value={position.id}>
    <Accordion.Trigger class="text-xl">{position.title}</Accordion.Trigger>
    <Accordion.Content>
        <p class=" mt-1">Career: { position.career }</p>

        <hr class="my-2">

        <p class="">Address: { position.address }</p>
        <p class=""># of Slots: { position.slots }</p>

        <hr class="my-2">

        <p class="">Summary:<br> { position.summary }</p>
        <p class=""><br>Instructions For Students:<br> { position.instructions }</p>
        <p class=""><br>Atture:<br> { position.attire }</p>

        <hr class="my-2">

        <p class=""><br>Primary Contact Name:<br> { position.contact_name }</p>
        <p class=""><br>Primary Email:<br> { position.contact_email }</p>
        
        <hr class="my-2">
        
        <p class="">Arrival: { position.arrival.toLocaleTimeString() }</p>
        <p class="">Start: { position.start.toLocaleTimeString() }</p>
        <p class="">End: { position.end.toLocaleTimeString() }</p>
    </Accordion.Content>
  </Accordion.Item>
{/each}
</Accordion.Root>

<Button href="/dashboard/createPosition" class="ml-10 mt-5"><CirclePlus size={16} /> Create New Position</Button>