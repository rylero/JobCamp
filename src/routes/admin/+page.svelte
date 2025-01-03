<script lang="ts">
    import type { X } from "lucide-svelte";
    import { onMount } from "svelte";
    import type { FormEventHandler } from "svelte/elements";

    var textarea: HTMLTextAreaElement;

    let autocomplete_box = $state({
        displaying: false,
        start_pos: -1,
        x: -1,
        y: -1,
    });

    const onTextAreaInput: FormEventHandler<HTMLTextAreaElement> = (event) => {
        let content = textarea.value;
        let currentPos = textarea.selectionEnd;
        console.log(event)
        if (content[currentPos-2] == "$" && content[currentPos-1] == "{") {
            autocomplete_box.start_pos = currentPos-1;
            autocomplete_box.displaying = true;
        }

        if (autocomplete_box.displaying && autocomplete_box.start_pos == currentPos-1) {
            autocomplete_box.displaying = false;
        }
    }
</script>

<div class={(!autocomplete_box.displaying ? "hidden " : "")+"fixed top-["+autocomplete_box.y+"] left-["+autocomplete_box.x+"] bg-black w-10 h-10"}>

</div>

<textarea cols="50" rows="10" class="m-10 border rounded border-black" bind:this={textarea} oninput={onTextAreaInput}></textarea>