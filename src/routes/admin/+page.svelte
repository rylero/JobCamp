<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from "$lib/components/ui/label/label.svelte";

    let query = $state({
        hosts: {
            active: false,
            emailVerified: { value: false, active: false },
            positionCount: { value: -1, active: false },
        }
    });

    let queryString = $derived(JSON.stringify(query))
</script>

<div class="flex">
    <div class="p-4 border-r-2 border-slate-900 min-h-screen min-w-[28rem]">
        <Button class="text-lg" onclick={() => query.hosts.active = !query.hosts.active}>Hosts</Button>
        {#if query.hosts.active}
        <div class="pl-8 pt-2 flex flex-col gap-2">
            <Label class="flex justify-between items-center text-lg w-full">
                <span class="flex gap-3 items-center"><input bind:checked={query.hosts.name.active} class="w-4 h-4" type="checkbox" />Name</span>
                <input bind:value={query.hosts.name.value} class="border border-slate-950 rounded px-2 w-48"/>
            </Label>
            <Label class="flex justify-between items-center text-lg w-full">
                <span class="flex gap-3 items-center"><input bind:checked={query.hosts.emailVerified.active} class="w-4 h-4" type="checkbox" />Email Verified</span>
                <select bind:value={query.hosts.emailVerified.value} class="border border-slate-950 rounded px-2">
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                </select>
            </Label>
            <Label class="text-lg">Company</Label>
            <div class="pl-8 flex flex-col gap-2">
                <Label class="flex justify-between items-center text-lg w-full">
                    <span class="flex gap-3 items-center"><input bind:checked={query.hosts.company.name.active} class="w-4 h-4" type="checkbox" />Name</span>
                    <input bind:value={query.hosts.company.name.value} class="border border-slate-950 rounded px-2 w-48" />
                </Label>
                <Label class="flex justify-between items-center text-lg w-full">
                    <span class="flex gap-3 items-center"><input bind:checked={query.hosts.company.description.active} class="w-4 h-4" type="checkbox" />Description</span>
                    <input bind:value={query.hosts.company.description.value} class="border border-slate-950 rounded px-2 w-48" />
                </Label>
                <Label class="flex justify-between items-center text-lg w-full">
                    <span class="flex gap-3 items-center"><input bind:checked={query.hosts.company.url.active} class="w-4 h-4" type="checkbox" />URL</span>
                    <input bind:value={query.hosts.company.url.value} class="border border-slate-950 rounded px-2 w-48" />
                </Label>
            </div>
        </div>
        {/if}
    </div>
    <div class="p-4">
        {queryString}
    </div>
</div>