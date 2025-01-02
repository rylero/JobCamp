<script lang="ts">
    import FAQ from "./faq.json";
    import * as Accordion from "$lib/components/ui/accordion/index.js";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { goto } from "$app/navigation";

    const questions = FAQ.Q;
    const answers = FAQ.A;

    const { data } = $props();
    const { isHost, loggedIn } = data;
</script>

<Navbar isHost={isHost} loggedIn={loggedIn} />

<div class="flex flex-col justify-center mt-28 mb-10 w-full">
  <h1 class="flex justify-center text-4xl mb-3">FAQs</h1>
  <Accordion.Root class="w-full px-10">
      {#each questions as question, index}
        <Accordion.Item value={question}>
          <Accordion.Trigger class="text-xl text-left">
              <span>{question}</span>
          </Accordion.Trigger>
          <Accordion.Content>
              <p class=" mt-1">{answers[index]}</p>
          </Accordion.Content>
        </Accordion.Item>
      {/each}
  </Accordion.Root>
</div>