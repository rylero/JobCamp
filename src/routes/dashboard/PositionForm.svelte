<script lang="ts">
    import { buttonVariants } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { careers } from "$lib/appconfig";
    import { superForm } from "sveltekit-superforms";

    let { data, formTitle, buttonName } = $props();

    const { form, errors, enhance } = superForm(data.form, {
        resetForm: false,
    });
</script>

<div class="mt-32 mb-5 w-full flex justify-center items-center">
    <form method="POST" action="?/createPosition" class="z-0 relative md:border-2 px-10 py-8 md:rounded-lg w-[700px] mx-5 flex flex-col gap-4 items-center justify-center" use:enhance>
        <h1 class="text-xl">{formTitle}</h1>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg" for="title">Position Title</Label>
            <Input name="title" id="title" bind:value={$form.title} />
            <span class="italic text-sm">E.g., 3rd Grade Teacher, Orthopedic Surgeon, Electrical Engineer</span>
            {#if $errors.title}<span class="text-sm text-red-500">{$errors.title}</span>{/if}
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg" for="career">Career</Label>
            <select bind:value={$form.career} name="career" id="career" class="border rounded-md px-2 py-2">
                {#each careers as career}
                    <option value={career}>{career}</option>
                {/each}
            </select>
       <span class="italic text-sm">If students will shadow more than 1 career, select "Multiple Careers"</span>
            {#if $errors.career}<span class="text-sm text-red-500">{$errors.career}</span>{/if}
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg"># of slots for students</Label>
            <Input type="number" name="slots" bind:value={$form.slots} />
            {#if $errors.slots}<span class="text-sm text-red-500">{$errors.slots}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg" for="sumamry">Summary</Label>
            <Textarea bind:value={$form.summary} name="summary" id="summary" />
            <span class="italic text-sm">What will students learn about and do?</span>
            {#if $errors.summary}<span class="text-sm text-red-500">{$errors.summary}</span>{/if}
        </div>
        
        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg w-28" for="name">Full Name</Label>
            <Input class="w-full" id="name" name="name" bind:value={$form.fullName}  />
            {#if $errors.fullName}<span class="text-sm text-red-500">{$errors.fullName}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg w-28" for="email">Email</Label>
            <Input class="w-full" id="email" name="email" bind:value={$form.email}  />
            {#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg" for="address">Address</Label>
            <Textarea name="address" id="address" bind:value={$form.address} />
            {#if $errors.address}<span class="text-sm text-red-500">{$errors.address}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg" for="instructions">Instructions For Students</Label>
            <Textarea name="instructions" bind:value={$form.instructions} id="instructions" placeholder="" class="h-full" />
            <span class="italic text-sm">Any other instructions students need to know. Include specific meeting location.</span>
            {#if $errors.instructions}<span class="text-sm text-red-500">{$errors.instructions}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label class="text-lg" for="attire">Attire Instructions</Label>
            <Textarea name="attire" bind:value={$form.attire} id="attire" class="h-full" />
            <span class="italic text-sm">E.g., Closed-toed shoes, no heels, no shorts, no sneakers, no jeans, etc. The more specific you can be, the better chance students will meet your requirements</span>
            {#if $errors.attire}<span class="text-sm text-red-500">{$errors.attire}</span>{/if}
        </div>
        
        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
                <Label class="text-lg" for="arrival">Arrival Time</Label>
                <Input bind:value={$form.arrival} class="w-max" name="arrival" id="arrival" type="time" />
            </div>
            {#if $errors.arrival}<span class="text-sm text-red-500 text-right">{$errors.arrival}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
                <Label class="text-lg" for="start">Start Time</Label>
                <Input bind:value={$form.start} class="w-max" name="start" id="start" type="time" />
            </div>
            {#if $errors.start}<span class="text-sm text-red-500 text-right">{$errors.start}</span>{/if}
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5 mb-5">
            <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
                <Label class="text-lg" for="release">End Time</Label>
                <Input bind:value={$form.release} class="w-max" name="release" id="release" type="time" />
            </div>
            {#if $errors.release}<span class="text-sm text-red-500 text-right">{$errors.release}</span>{/if}
        </div>
        

        <div class="w-full flex justify-center gap-4">
            <a href="/dashboard" class={buttonVariants({ variant: "outline" }) + " w-28 py-4 border-blue-500 border-2"}>Cancel</a>
            <button type="submit" class={buttonVariants({variant: "default"}) + " w-28 py-4"}>{buttonName}</button>
        </div>
    </form>
</div>

<div class="h-2"></div>
