<script lang="ts">
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";

    // import Button from "$lib/components/ui/button/button.svelte";
    // import Input from "$lib/components/ui/input/input.svelte";
    // import Label from "$lib/components/ui/label/label.svelte";
    // import * as Table from "$lib/components/ui/table/index.js";
    // import Textarea from "$lib/components/ui/textarea/textarea.svelte";

    // let showingDraft = $state(false);

    // let query = $state({
    //     hosts: {
    //         active: false,
    //         emailVerified: { value: false, active: false },
    //         positions: { value: "=0", active: false },
    //     }
    // });

    // let queryString = $derived(JSON.stringify(query))

    // let data: any = $state(null);
    // async function getData() {
    //     let res = await fetch('api/adminQuery', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(query)
    //     })
    //     return await res.json();
    // };

    // function addPrefixToProps(obj: any, prefix: string) {
    //     let newObj: any = {};
    //     for (const key in obj) {
    //         if (obj.hasOwnProperty(key)) {
    //             newObj[prefix + key] = obj[key];
    //         }
    //     }
    //     return newObj;
    // }

    // export const flattenObject = (obj: any) => {
    //     let flattened: any = {};

    //     Object.keys(obj).forEach((key) => {
    //         const value = obj[key]

    //         if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    //             Object.assign(flattened, flattenObject(addPrefixToProps(value, key + ".")))
    //         } else {
    //             flattened[key] = value
    //         }
    //     })

    //     return flattened;
    // }

    // const props = (data: any) => {
    //     if (!data || data.length == 0) {
    //         return [];
    //     }
    //     let row = data[0];
    //     return Object.keys(flattenObject(row));
    // }

    // const switchScreens = () => {
    //     showingDraft = !showingDraft;
    // }

    let { data } = $props();
    let positions = data.positions;
    let students = data.students;

    let studentNames = students.map(v => {return { 
        value: v.id, 
        label: v.firstName + " " + v.lastName
    }
    }).sort((a, b) => a.label.localeCompare(b.label));

    let positionNames = positions.map(v => {return { 
        value: v.id, 
        label: v.host.company?.companyName + " - " + v.title
    }
    }).sort((a, b) => a.label.localeCompare(b.label));
    
    let open = $state(false);
    let value = $state("");
    let triggerRef = $state<HTMLButtonElement>(null!);
    
    const selectedValue = $derived(
        studentNames.find((f) => f.value === value)?.label
    );
    
    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
        triggerRef.focus();
        });
    }


    let open2 = $state(false);
    let value2 = $state("");
    let triggerRef2 = $state<HTMLButtonElement>(null!);
    
    const selectedValue2 = $derived(
        positionNames.find((f) => f.value === value2)?.label
    );
    
    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger2() {
        open2 = false;
        tick().then(() => {
        triggerRef2.focus();
        });
    }


    let studentPermissionSlip = $derived(students.filter(v => v.id == value)[0]?.permissionSlipCompleted);
</script>

<div>
<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-[200px] justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        {selectedValue || "Select a student..."}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each studentNames as framework}
            <Command.Item
              value={framework.value}
              onSelect={() => {
                value = framework.value;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn(
                  "mr-2 size-4",
                  value !== framework.value && "text-transparent"
                )}
              />
              {framework.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>


<Popover.Root bind:open={open2}>
    <Popover.Trigger bind:ref={triggerRef2}>
      {#snippet child({ props })}
        <Button
          variant="outline"
          class="min-w-[300px] justify-between"
          {...props}
          role="combobox"
          aria-expanded={open2}
        >
          {selectedValue2 || "Select a position..."}
          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="min-w-[300px] p-0">
      <Command.Root>
        <Command.Input placeholder="Search framework..." />
        <Command.List>
          <Command.Empty>No framework found.</Command.Empty>
          <Command.Group>
            {#each positionNames as framework}
              <Command.Item
                value={framework.value}
                onSelect={() => {
                  value2 = framework.value;
                  closeAndFocusTrigger2();
                }}
              >
                <Check
                  class={cn(
                    "mr-2 size-4",
                    value2 !== framework.value && "text-transparent"
                  )}
                />
                {framework.label}
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
<div>
    Permission Slip: {studentPermissionSlip}
    <form method="POST" action="?/add">
        <input type="hidden" name="studentid" bind:value={value} />
        <input type="hidden" name="positionid" bind:value={value2} />
        <Button type="submit">Set</Button>
    </form>
</div>
<!-- <div class="flex"> -->

    <!-- {#if !showingDraft}
    <div class="p-4 border-r-2 border-slate-900 min-h-screen min-w-[24rem]">
        <Button class="text-lg" onclick={() => {
            query.hosts.active = !query.hosts.active;
            data = getData()}}
        >Hosts</Button>
        {#if query.hosts.active}
        <div class="pl-8 pt-2 flex flex-col gap-2">
            <Label class="flex justify-between items-center text-lg w-full">
                <span class="flex gap-3 items-center"><input onchange={() => data = getData()} bind:checked={query.hosts.emailVerified.active} class="w-4 h-4" type="checkbox" />Email Verified</span>
                <select onchange={() => data = getData()} bind:value={query.hosts.emailVerified.value} class="border border-slate-950 rounded px-2">
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                </select>
            </Label>
            <Label class="flex justify-between items-center text-lg w-full">
                <span class="flex gap-3 items-center"><input onchange={() => data = getData()} bind:checked={query.hosts.positions.active} class="w-4 h-4" type="checkbox" />Positions</span>
                <select onchange={() => data = getData()} bind:value={query.hosts.positions.value} class="border border-slate-950 rounded px-2">
                    <option value={">0"}>At least one</option>
                    <option value={"=0"}>None</option>
                </select>
            </Label>
        </div>
        {/if}
    </div>
    <div class="p-4">
        {#if data}
        {#await data}
            Loading data...
        {:then tableData}
        <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Email</Table.Head>
                <Table.Head>Name</Table.Head>
                <Table.Head>Company Name</Table.Head>
                <Table.Head>Email Verified</Table.Head>
                <Table.Head>Position Count</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each tableData as row, i (i)}
                <Table.Row>
                  <Table.Cell>{row.user.email}</Table.Cell>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.company.companyName}</Table.Cell>
                  <Table.Cell>{row.user.emailVerified}</Table.Cell>
                  <Table.Cell>{row.positions.length}</Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
        </Table.Root>
        {:catch someError}
		    System error: {someError.message}.
        {/await}
        {/if}
    </div>

    <Button onclick={() => switchScreens()} class="fixed bottom-4 right-4 text-lg">Draft Email</Button>
    {:else}
    <div class="p-4 border-r-2 border-slate-900 min-h-screen min-w-[24rem]">
        {#await data}
            Loading data...
        {:then tableData}
            <ul>
                {#each props(tableData) as p, i (i)}
                    <li>${p}</li>
                {/each}
            </ul>
        {:catch someError}
		    System error: {someError.message}.
        {/await}
    </div>
    <div class="flex flex-col items-center w-full mx-20 gap-10">
        <label class="flex items-center mt-4 text-lg gap-4">Subject: <Input class="w-96 border-black border-2" /></label>
        <Textarea class="mx-20 border-black border-2 h-full" />
        <Button class="mb-4 mx-auto text-xl px-8 py-5">Send</Button>
    </div>

    <Button onclick={() => switchScreens()} class="fixed bottom-4 right-4 text-lg">Back</Button>
    {/if} -->
<!-- </div> -->