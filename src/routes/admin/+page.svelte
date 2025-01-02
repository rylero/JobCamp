<script lang="ts">
    import { onMount } from "svelte";
    import type { FormEventHandler } from "svelte/elements";

    var textarea: HTMLTextAreaElement;

    let autocomplete_box = $state({
        displaying: false,
        start_pos: -1,
    });

    $inspect(
        autocomplete_box
    )

    const onTextAreaInput: FormEventHandler<HTMLTextAreaElement> = (event) => {
        let content = textarea.value;
        let currentPos = textarea.selectionEnd;
        if (content[currentPos-2] == "$" && content[currentPos-1] == "{") {
            autocomplete_box.start_pos = currentPos-1;
            autocomplete_box.displaying = true;
        }

        if (autocomplete_box.displaying && autocomplete_box.start_pos == currentPos-1) {
        }
    }
</script>

<textarea cols="50" rows="10" class="m-10 border rounded border-black" bind:this={textarea} oninput={onTextAreaInput}></textarea>