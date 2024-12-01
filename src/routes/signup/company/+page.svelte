<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { superForm } from "sveltekit-superforms";

    let { data } = $props();

    const { form, errors, enhance } = superForm(data.form, {
        resetForm: false,
		clearOnSubmit: 'none'
    });

    let showPassword = $state(false);
    let passwordEntryType = $derived(showPassword ? 'text' : 'password')
</script>
<div class="w-full min-h-screen flex flex-col gap-8 justify-center items-center">
    <form method="POST" class="flex flex-col justify-between items-center gap-4 py-10 px-10 border-2 rounded-lg shadow-2xl" use:enhance>
        <h1 class="text-4xl">Sign Up</h1>

        <div class="flex w-96 justify-between items-center">
            <label for="grade">School</label>
            <select class="px-2 py-2 rounded w-52 border" name="grade" bind:value={$form.schoolId}>
                {#each Object.keys(data.schoolMapping) as schoolId}
                    <option value={schoolId} selected={$form.schoolId == schoolId}>{data.schoolMapping[schoolId]}</option>
                {/each}
            </select>
        </div>
        {#if $errors.schoolId}<span class="text-sm text-red-500">{$errors.schoolId}</span>{/if}

        <div class="flex w-96 justify-between items-center">
            <label for="companyName">Company Name</label>
            <Input class="px-2 py-0.5 rounded w-52" type="text" name="companyName" bind:value={$form.companyName} />
        </div>
        {#if $errors.companyName}<span class="text-sm text-red-500">{$errors.companyName}</span>{/if}

        <div class="flex w-96 justify-between items-center">
            <label for="companyDescription">Company Description</label>
            <Input class="px-2 py-0.5 rounded w-52" type="text" name="companyDescription" bind:value={$form.companyDescription} />
        </div>
        {#if $errors.companyDescription}<span class="text-sm text-red-500">{$errors.companyDescription}</span>{/if}

        <div class="flex w-96 justify-between items-center">
            <label for="companyUrl">Company Url</label>
            <Input class="px-2 py-0.5 rounded w-52" type="text" name="companyUrl" bind:value={$form.companyUrl} />
        </div>
        {#if $errors.companyUrl}<span class="text-sm text-red-500">{$errors.companyUrl}</span>{/if}

        <div class="flex w-96 justify-between items-center">
            <label for="name">Full Name</label>
            <Input class="px-2 py-0.5 rounded w-52" type="text" name="name" bind:value={$form.name} />
        </div>
        {#if $errors.name}<span class="text-sm text-red-500">{$errors.name}</span>{/if}
        
        <div class="flex w-96 justify-between items-center">
            <label for="email">Email</label>
            <Input class="px-2 py-0.5 rounded w-52" type="text" name="email" bind:value={$form.email} />
        </div>
        {#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}

        <div class="flex w-96 justify-between items-center">
            <label for="password">Password</label>
            <Input class="px-2 py-0.5 rounded w-52" {...{ type: passwordEntryType }} name="password" bind:value={$form.password} />
        </div>
        {#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}
        
        <div class="flex w-96 justify-center items-center">
            <Checkbox class="rounded mr-2" bind:checked={showPassword} /><label>Show Password</label>
        </div>

        <button type="submit" class="mt-2 w-24 h-8 rounded bg-blue-500 text-white hover:bg-blue-600">Sign Up</button>
    </form>
    <a href="/login" class="underline text-blue-500">Do you want to login?</a>
</div> 