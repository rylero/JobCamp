<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from "$lib/components/ui/label/label.svelte";

    let query = $state({
        hosts: {
            active: false,
            emailVerified: { value: false, active: false },
            positions: { value: "=0", active: false },
        }
    });

    let queryString = $derived(JSON.stringify(query))
</script>

<div class="flex">
    <div class="p-4 border-r-2 border-slate-900 min-h-screen min-w-[24rem]">
        <Button class="text-lg" onclick={() => query.hosts.active = !query.hosts.active}>Hosts</Button>
        {#if query.hosts.active}
        <div class="pl-8 pt-2 flex flex-col gap-2">
            <Label class="flex justify-between items-center text-lg w-full">
                <span class="flex gap-3 items-center"><input bind:checked={query.hosts.emailVerified.active} class="w-4 h-4" type="checkbox" />Email Verified</span>
                <select bind:value={query.hosts.emailVerified.value} class="border border-slate-950 rounded px-2">
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                </select>
            </Label>
            <Label class="flex justify-between items-center text-lg w-full">
                <span class="flex gap-3 items-center"><input bind:checked={query.hosts.positions.active} class="w-4 h-4" type="checkbox" />Positions</span>
                <select bind:value={query.hosts.positions.value} class="border border-slate-950 rounded px-2">
                    <option value={">0"}>At least one</option>
                    <option value={"=0"}>None</option>
                </select>
            </Label>
        </div>
        {/if}
    </div>
    <div class="p-4">
        {queryString}
    </div>
</div>