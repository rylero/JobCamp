<script lang="ts">
  import Navbar from "$lib/components/navbar/Navbar.svelte";
  import { Edit, Trash } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { enhance } from "$app/forms";

  let { data } = $props();
</script>

<Navbar loggedIn={true} isHost={true} isAdmin={false} />

<div class="h-24"></div>

<h1 class="mx-10 my-2 text-2xl">
  Positions for Los Gatos High School JobCamp day: March 10, 2025
</h1>
<p class="mx-10">
  Create one or more positions for job shadow day. A position represents a
  career you'll be exposing students to.<br />E.g., Teacher, Software developer,
  Architect, or Real estate agent.
</p>

<Accordion.Root type="multiple" class="w-full px-10 my-5">
  {#each data.positions as position}
    <Accordion.Item value={position.id} class="my-2">
      <Accordion.Trigger
        class="text-xl bg-slate-100 hover:bg-slate-200 rounded-t-sm px-5"
      >
        <span>{position.title}</span>
      </Accordion.Trigger>
      <Accordion.Content class="px-5">
        <div class="flex gap-5">
          <a
            href={"/dashboard/editPosition?posId=" + position.id}
            class="flex gap-1 items-center align-middle text-lg mt-2"
            ><Edit class="z-50" size={24} /> Edit</a
          >
          <AlertDialog.Root>
            <AlertDialog.Trigger
              class="flex gap-1 items-center align-middle text-lg mt-2"
              ><Trash class="z-50" size={24} /> Delete</AlertDialog.Trigger
            >
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Delete this position?</AlertDialog.Title>
                <AlertDialog.Description>
                  This cannot be undone.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action
                  ><form
                    use:enhance
                    method="POST"
                    action={"?/deletePosition&posId=" + position.id}
                  >
                    <button type="submit">Delete</button>
                  </form></AlertDialog.Action
                >
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </div>

        <hr class="my-2" />

        <p class=" mt-1">Career: {position.career}</p>
        <br />
        <p class=""># of slots for students: {position.slots}</p>

        <hr class="my-2" />

        <p class=" whitespace-pre-line">
          Address:
          {position.address}

          Summary:
          {position.summary}

          Instructions For Students:
          {position.instructions}

          Attire:
          {position.attire}
        </p>

        <hr class="my-2" />

        <p class="">
          <br />Primary Contact Name:<br />
          {position.contact_name}
        </p>
        <p class=""><br />Primary Email:<br /> {position.contact_email}</p>

        <hr class="my-2" />

        <p class="">Arrival: {position.arrival}</p>
        <p class="">Start: {position.start}</p>
        <p class="">End: {position.end}</p>

        <hr class="my-2" />

        <!--href={position.attachment1.url} href={position.attachment2.url}-->
        <!-- {#if position.attachment1}<a>Attachment 1: { position.attachment1.name }</a>{/if}
        {#if position.attachment2}<a>Attachment 2: { position.attachment2.name }</a>{/if} -->
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>

<Button href="/dashboard/createPosition" class="ml-10 mt-5 text-lg"
  >Create New Position</Button
>
