<script lang="ts">
    import { Button, buttonVariants } from "../../../lib/components/ui/button";
    import { Input } from "../../../lib/components/ui/input";
    import { Label } from "../../../lib/components/ui/label";
    import { Textarea } from "../../../lib/components/ui/textarea";
    import { careers } from "$lib/appconfig";
    import { X } from "lucide-svelte";
    import { superForm } from "sveltekit-superforms";

    let { data } = $props();

    const { form, errors, enhance } = superForm(data.form, {
        resetForm: false,
    });

    let formElement: HTMLFormElement; 
</script>

<div class="w-full min-h-[calc(100vh-5rem)] flex justify-center items-center">
    <form bind:this={formElement} method="POST" action="?/createPosition" class="z-0 relative md:border-2 px-10 py-8 rounded-lg w-[700px] mx-5 flex flex-col gap-4 items-center justify-center" use:enhance>
        <h1 class="text-xl">Edit Position</h1>
        
        <input hidden name="posId" value={data.posId} />

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="title">Title</Label>
            <Input name="title" id="title" bind:value={$form.title} />
            {#if $errors.title}<span class="text-sm text-red-500">{$errors.title}</span>{/if}
        </div>
        <div class="flex w-full max-w-sm justify-between gap-3">
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="career">Career</Label>
                <select bind:value={$form.career} name="career" id="career" class="border rounded-md px-2 py-2">
                    {#each careers as career}
                        <option value={career}>{career}</option>
                    {/each}
                </select>
                {#if $errors.career}<span class="text-sm text-red-500">{$errors.career}</span>{/if}
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label>Slots</Label>
                <Input type="number" name="slots" bind:value={$form.slots} />
                {#if $errors.slots}<span class="text-sm text-red-500">{$errors.slots}</span>{/if}
            </div>
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="sumamry">Summary</Label>
            <Textarea bind:value={$form.summary} name="summary" id="summary" placeholder="What will students learn about and do?" />
            {#if $errors.summary}<span class="text-sm text-red-500">{$errors.summary}</span>{/if}
        </div>
        
        <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
            <Label for="name" class="w-28">Full Name</Label>
            <Input class="w-full" id="name" name="name" bind:value={$form.fullName}  />
            {#if $errors.fullName}<span class="text-sm text-red-500">{$errors.fullName}</span>{/if}
        </div>

        <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
            <Label for="email" class="w-28">Email</Label>
            <Input class="w-full" id="email" name="email" bind:value={$form.email}  />
            {#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="address">Address</Label>
            <Textarea name="address" id="address" bind:value={$form.address} />
            {#if $errors.address}<span class="text-sm text-red-500">{$errors.address}</span>{/if}
        </div>
        
        <div class="flex w-full max-w-sm justify-between gap-3">
            <div class="flex flex-col gap-1.5">
                <div class="flex w-full max-w-sm flex-col gap-1.5">
                    <Label for="instructions">Instructions For Students</Label>
                    <Textarea name="instructions" bind:value={$form.instructions} id="instructions" placeholder="Any other instructions students need to know. Include specific meeting location." class="h-full" />
                    {#if $errors.instructions}<span class="text-sm text-red-500">{$errors.instructions}</span>{/if}
                </div>
                <div class="flex w-full max-w-sm flex-col gap-1.5">
                    <Label for="attire">Attire Instructions</Label>
                    <Textarea name="attire" bind:value={$form.attire} id="attire" placeholder="E.g., Closed-toed shoes, no heels, no shorts, no sneakers, no jeans, etc. The more specific you can be, the better chance students will meet your requirements" class="h-full" />
                    {#if $errors.attire}<span class="text-sm text-red-500">{$errors.attire}</span>{/if}
                </div>
            </div>
            <div class="flex flex-col gap-1.5">    
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="arrival">Arrival Time</Label>
                    <Input bind:value={$form.arrival} class="w-max" name="arrival" id="arrival" type="time" />
                    {#if $errors.arrival}<span class="text-sm text-red-500">{$errors.arrival}</span>{/if}
                </div>
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="start">Start Time</Label>
                    <Input bind:value={$form.start} class="w-max" name="start" id="start" type="time" />
                    {#if $errors.start}<span class="text-sm text-red-500">{$errors.start}</span>{/if}
                </div>
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="release">Release Time</Label>
                    <Input bind:value={$form.release} class="w-max" name="release" id="release" type="time" />
                    {#if $errors.release}<span class="text-sm text-red-500">{$errors.release}</span>{/if}
                </div>
            </div>
        </div>
        

        <div class="w-full flex justify-center">
            <Button onclick={() => formElement.submit()} class="w-28 py-4 text-lg">Create</Button>
        </div>

        <div class="w-full flex justify-center">
            <a href="/dashboard" class={buttonVariants({ variant: "secondary" }) + " w-28 py-4 text-lg"}>Cancel</a>
        </div>
    </form>
</div>

<div class="h-2"></div>