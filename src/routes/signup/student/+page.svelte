<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { superForm } from "sveltekit-superforms";
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    let { data } = $props();

    const { form, errors, enhance, message } = superForm(data.form, {
        resetForm: false,
		clearOnSubmit: 'none'
    });

    let showPassword = $state(false);
    let passwordEntryType = $derived(showPassword ? 'text' : 'password')
</script>

<Navbar isHost={false} loggedIn={false} />

<div class="w-full mt-28 flex flex-col sm:gap-8 justify-center items-center">
    <form method="POST" class="max-w-full flex flex-col justify-between items-center gap-4 py-10 px-10 sm:border-2 sm:rounded-lg sm:shadow-2xl" use:enhance>
        <h1 class="text-4xl">Sign Up</h1>
        {#if $message}<span class="text-sm text-red-500">{$message}</span>{/if}
        <div class="flex w-96 justify-between items-center">
            <label for="grade">School</label>
            <select class="px-2 py-2 rounded w-52 min-w-52 border" name="grade" bind:value={$form.schoolId}>
                {#each Object.keys(data.schoolMapping) as schoolId}
                    <option value={schoolId} selected={$form.schoolId == schoolId}>{data.schoolMapping[schoolId]}</option>
                {/each}
            </select>
        </div>
        {#if $errors.schoolId}<span class="text-sm text-red-500">{$errors.schoolId}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="grade">Grade</label>
            <select class="px-2 py-2 rounded w-52 min-w-52 border" name="grade" bind:value={$form.grade}>
                {#each [9,10,11,12] as grade}
                    <option value={grade} selected={$form.grade == grade}>{grade}th Grade</option>
                {/each}
            </select>
        </div>
        {#if $errors.grade}<span class="text-sm text-red-500">{$errors.grade}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="name">Full Name</label>
            <Input class="px-2 py-0.5 rounded w-52 min-w-52" type="text" name="name" bind:value={$form.name} />
        </div>
        {#if $errors.name}<span class="text-sm text-red-500">{$errors.name}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="parentEmail">Parent Email</label>
            <Input class="px-2 py-0.5 rounded w-52 min-w-52" type="text" name="parentEmail" bind:value={$form.parentEmail} />
        </div>
        {#if $errors.parentEmail}<span class="text-sm text-red-500">{$errors.parentEmail}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="phone">Phone</label>
            <Input class="px-2 py-0.5 rounded w-52 min-w-52" type="text" name="phone" bind:value={$form.phone} />
        </div>
        {#if $errors.phone}<span class="text-sm text-red-500">{$errors.phone}</span>{/if}

        <div class="flex w-96 justify-center items-center gap-2">
            <Checkbox class="rounded" name="allowPhoneMessaging" bind:checked={$form.allowPhoneMessaging} />
            <label for="allowPhoneMessaging">Allow SMS Messaging</label>
        </div>
        {#if $errors.allowPhoneMessaging}<span class="text-sm text-red-500">{$errors.allowPhoneMessaging}</span>{/if}
        
        <div class="flex w-96 justify-between">
            <label for="email">Email</label>
            <Input class="px-2 py-0.5 rounded w-52 min-w-52" type="text" name="email" bind:value={$form.email} />
        </div>
        {#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="password">Password</label>
            <Input class="px-2 py-0.5 rounded w-52 min-w-52" {...{ type: passwordEntryType }} name="password" bind:value={$form.password} />
        </div>
        {#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}
        
        <div class="flex w-96 justify-center items-center">
            <Checkbox class="rounded mr-2" bind:checked={showPassword} /><span>Show Password</span>
        </div>

        <button type="submit" class="mt-2 w-24 h-8 rounded bg-blue-500 text-white hover:bg-blue-600">Sign Up</button>
    </form>
    <a href="/login" class="underline text-blue-500">Do you want to login?</a>
</div> 