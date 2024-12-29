<script lang="ts">
    import FAQ from "./faq.json";
    import * as Accordion from "$lib/components/ui/accordion/index.js";
    import NonDashNav from "$lib/components/navbar/NonDashNav.svelte";
    import { goto } from "$app/navigation";

    const questions = FAQ.Q;
    const answers = FAQ.A;

    const { data } = $props();
    const { schoolData, loggedIn } = data;

    if (schoolData == undefined) {
      goto("/");
    }
</script>

<NonDashNav schoolData={schoolData} loggedIn={loggedIn} />

<div class="flex flex-col justify-center mt-28 mb-10 w-full">
  <h1 class="flex justify-center text-4xl mb-3">FAQ's</h1>
  <Accordion.Root class="w-full px-10">
      {#each questions as question, index}
        <Accordion.Item value={question}>
          <Accordion.Trigger class="text-xl">
              <span>{question}</span>
          </Accordion.Trigger>
          <Accordion.Content>
              <p class=" mt-1">{answers[index]}</p>
          </Accordion.Content>
        </Accordion.Item>
      {/each}
  </Accordion.Root>
</div>