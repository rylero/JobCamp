<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";

    var { data } = $props();

    var form: HTMLFormElement;
</script>

<div class="flex flex-col px-10 min-h-96 py-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center gap-8 border-4 bg-slate-100">
    <h1>Check Your Inbox for a Email Verification Link</h1>
    <p class="text-red">{data.msg}</p>
    <form method="POST" action="?/resend" bind:this={form}>
        <Button onclick={() => form.submit()} class="mt-2 w-24 h-8 rounded bg-blue-500 text-white hover:bg-blue-600">Resend</Button>
    </form>
</div> 