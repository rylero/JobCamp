<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import type { PageData } from "./$types";
    import SuperDebug from "sveltekit-superforms";

    export let data: PageData;

    const { form, errors, enhance } = superForm(data.form, {
        resetForm: false,
		clearOnSubmit: 'none'
    });

    let showPassword = false;
    $: passwordEntryType = showPassword ? 'text' : 'password'
</script>

<div class="flex flex-col px-10 min-h-96 py-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center gap-8 border-4 bg-slate-100">
    <h1 class="text-4xl">Sign Up</h1>
    <form method="POST" class="flex flex-col justify-center items-center gap-3" use:enhance>
        <div class="flex w-96 justify-between">
            <label for="grade">Grade</label>
            <select class="px-2 py-0.5 rounded w-52" name="grade" bind:value={$form.grade}>
                {#each [9,10,11,12] as grade}
                    <option value={grade} selected={$form.grade == grade}>{grade}th Grade</option>
                {/each}
            </select>
        </div>
        {#if $errors.grade}<span class="text-sm text-red-500">{$errors.grade}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="name">Full Name</label>
            <input class="px-2 py-0.5 rounded w-52" type="text" name="name" bind:value={$form.name} />
        </div>
        {#if $errors.name}<span class="text-sm text-red-500">{$errors.name}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="parentEmail">Parent Email</label>
            <input class="px-2 py-0.5 rounded w-52" type="text" name="parentEmail" bind:value={$form.parentEmail} />
        </div>
        {#if $errors.parentEmail}<span class="text-sm text-red-500">{$errors.parentEmail}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="phone">Phone</label>
            <input class="px-2 py-0.5 rounded w-52" type="text" name="phone" bind:value={$form.phone} />
        </div>
        {#if $errors.phone}<span class="text-sm text-red-500">{$errors.phone}</span>{/if}

        <div class="flex w-96 justify-center gap-2">
            <input class="px-2 py-0.5 rounded" type="checkbox" name="allowPhoneMessaging" bind:checked={$form.allowPhoneMessaging} />
            <label for="allowPhoneMessaging">Allow Phone Messaging</label>
        </div>
        {#if $errors.allowPhoneMessaging}<span class="text-sm text-red-500">{$errors.allowPhoneMessaging}</span>{/if}
        
        <div class="flex w-96 justify-between">
            <label for="email">Email</label>
            <input class="px-2 py-0.5 rounded w-52" type="text" name="email" bind:value={$form.email} />
        </div>
        {#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}

        <div class="flex w-96 justify-between">
            <label for="password">Password</label>
            <input class="px-2 py-0.5 rounded w-52" {...{ type: passwordEntryType }} name="password" bind:value={$form.password} />
        </div>
        {#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}
        
        <div class="flex w-96 justify-center">
            <label><input type="checkbox" bind:checked={showPassword} /> Show Password</label>
        </div>

        <button type="submit" class="mt-2 w-24 h-8 rounded bg-blue-500 text-white hover:bg-blue-600">Sign Up</button>
    </form>
    <a href="/login" class="underline text-blue-500">Do you want to login?</a>
</div> 