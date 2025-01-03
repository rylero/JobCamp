<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import type { X } from "lucide-svelte";
    import { onMount } from "svelte";
    import type { FormEventHandler } from "svelte/elements";

    var textarea: HTMLTextAreaElement;
</script>


<div class="border rounded border-black w-[640px] m-10 flex flex-col">
    <textarea rows="20" bind:this={textarea}></textarea>
    <h1>Company</h1>
    <div class="flex flex-row">
        <Button variant="outline">Company Name</Button>
        <Button>Host Name</Button>
    </div>
</div>