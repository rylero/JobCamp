<script lang="ts">
    import { Button } from "../ui/button";
    import { Input } from "../ui/input";
    import { Label } from "../ui/label";
    import { Textarea } from "../ui/textarea";
    import { careers } from "$lib/appconfig";
    import { X } from "lucide-svelte";
    import { superForm } from "sveltekit-superforms";

    let { formHandler, closeScreen } = $props();

    const { form, errors, enhance } = superForm(formHandler, {
        resetForm: false,
		clearOnSubmit: 'none'
    });
</script>

<div class="w-full min-h-[calc(100vh-5rem)] flex justify-center items-center">
    <form method="POST" action="?/createPosition" class="z-0 relative md:border-2 px-10 py-8 rounded-lg w-[700px] mx-5 flex flex-col gap-4 items-center justify-center" use:enhance>
        <h1 class="text-xl">Create New Position</h1>
        <X onclick={closeScreen} class="absolute top-3 right-3 hover:cursor-pointer"/>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="title">Title</Label>
            <Input name="title" id="title" bind:value={$form.title} />
            {#if $errors.title}<span class="text-sm text-red-500">{$errors.title}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="career">Career</Label>
            <select id="career" class="border rounded-md px-2 py-2">
                {#each careers as career}
                    <option value="career">{career}</option>
                {/each}
            </select>
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="sumamry">Summary</Label>
            <Textarea id="summary" placeholder="What will students learn about and do?" />
        </div>
        
        <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
            <Label for="name" class="w-28">Full Name</Label>
            <Input class="w-full" id="name" bind:value={$form.fullName}  />
        </div>

        <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
            <Label for="email" class="w-28">Email</Label>
            <Input class="w-full" id="email" bind:value={$form.email}  />
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="address">Address</Label>
            <Textarea id="address" />
        </div>
        
        <div class="flex w-full max-w-sm justify-between gap-3">
            <div class="flex flex-col gap-1.5">
                <div class="flex w-full max-w-sm flex-col gap-1.5">
                    <Label for="instructions">Instructions For Students</Label>
                    <Textarea id="instructions" placeholder="Any other instructions students need to know. Include specific meeting location." class="h-full" />
                </div>
                <div class="flex w-full max-w-sm flex-col gap-1.5">
                    <Label for="instructions">Attire Instructions</Label>
                    <Textarea id="instructions" placeholder="E.g., Closed-toed shoes, no heels, no shorts, no sneakers, no jeans, etc. The more specific you can be, the better chance students will meet your requirements" class="h-full" />
                </div>
            </div>
            <div class="flex flex-col gap-1.5">
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="arrival">Arrival Time</Label>
                    <Input class="w-max" id="arrival" type="time" />
                </div>
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="arrival">Start Time</Label>
                    <Input class="w-max" id="arrival" type="time" />
                </div>
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="release">Release Time</Label>
                    <Input class="w-max" id="release" type="time" />
                </div>
            </div>
        </div>
        

        <div class="w-full flex justify-center">
            <Button type="submit" class="w-28 py-4 text-lg">Create</Button>
        </div>
    </form>
</div>

<div class="h-2"></div>