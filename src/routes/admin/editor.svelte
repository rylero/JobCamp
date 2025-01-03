<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";

    var textarea: HTMLTextAreaElement;

    function addMacro(macro: string) {
        if (textarea) {
            let pre = textarea.value.substring(0, textarea.selectionEnd);
            let post = textarea.value.substring(textarea.selectionEnd);
            textarea.value = pre + macro + post;
        }
    }
</script>


<div class="border rounded border-black w-[640px] m-10 flex flex-col">
    <textarea rows="20" class="p-2" bind:this={textarea}></textarea>
    <h1 class="text-xl border-t border-t-black pl-3 py-2">Company</h1>
    <div class="flex flex-row gap-1 pl-3 pb-3">
        <Button class="p-2 h-8 text-sm" onclick={() => addMacro("${company.name}")}>Company Name</Button>
        <Button class="p-2 h-8 text-sm" onclick={() => addMacro("${host.name}")}>Host Name</Button>
    </div>
</div>