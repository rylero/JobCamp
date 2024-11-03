<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import type { PageData } from "./$types";

    export let data: PageData;

    const { form, errors, enhance } = superForm(data.form, {
        resetForm: false,
		clearOnSubmit: 'none'
    });
</script>

<div class="flex flex-col px-10 min-h-96 py-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center gap-8 border-4 bg-slate-100">
    <h1 class="text-4xl">Permission Slip</h1>
    <form method="POST" class="flex flex-col justify-center items-center gap-3" use:enhance>
        <div class="flex w-96 justify-between">
            <label for="sample">Sample</label>
            <input class="px-2 py-0.5 rounded w-52" type="text" name="sample" bind:value={$form.sample} />
        </div>
        {#if $errors.sample}<span class="text-sm text-red-500">{$errors.sample}</span>{/if}

        <button type="submit" class="mt-2 w-24 h-8 rounded bg-blue-500 text-white hover:bg-blue-600">Complete</button>
    </form>
</div>