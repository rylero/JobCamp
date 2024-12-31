<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import type { PageData } from "./$types";
    import { Input } from "$lib/components/ui/input";
    import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    const { form, errors, enhance, message } = superForm(data.form, {
        resetForm: false,
		clearOnSubmit: 'none'
    });

    let showPassword = $state(false);
    let passwordEntryType = $derived(showPassword ? 'text' : 'password')
</script>

<Navbar isHost={false} loggedIn={false} />

<div class="w-full h-screen flex flex-col sm:gap-8 justify-center items-center">
    <form method="POST" class="max-w-full flex flex-col justify-between items-center gap-4 py-10 px-10 sm:border-2 sm:rounded-lg sm:shadow-2xl" use:enhance>
        <h1 class="text-4xl">Login</h1>
        {#if $message}<span class="text-sm text-red-500">{$message}</span>{/if}

        <div class="flex max-w-full w-96 justify-between items-center">
            <label for="email">Email</label>
            <Input class="px-2 py-0.5 rounded w-52 min-w-52" type="text" name="email" bind:value={$form.email} />
        </div>
        {#if $errors.email}<span class="text-sm text-red-500">{$errors.email}</span>{/if}

        <div class="flex max-w-full w-96 justify-between items-center">
            <label for="password">Password</label>
            <Input class="px-2 py-0.5 rounded w-52 min-w-52" {...{ type: passwordEntryType }} name="password" bind:value={$form.password} />
        </div>
        {#if $errors.password}<span class="text-sm text-red-500">{$errors.password}</span>{/if}
        
        <div class="flex max-w-full w-96 justify-center">
            <label><Checkbox bind:checked={showPassword} /> Show Password</label>
        </div>

        <button type="submit" class="mt-2 w-24 h-8 rounded bg-blue-500 text-white hover:bg-blue-600">Login</button>
    </form>
    <a href="/signup" class="underline text-blue-500">Do you want to signup?</a>
</div>