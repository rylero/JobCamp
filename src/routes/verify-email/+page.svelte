<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    var { data } = $props();

    var form: HTMLFormElement;
</script>

<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between items-center gap-4 py-10 px-10 sm:border-2 sm:rounded-lg sm:shadow-2xl w-full">
    <h1 class="text-xl text-center">Check your inbox for an email verification link</h1>
    <p class="text-red">{data.msg}</p>
    <form method="POST" action="?/resend" bind:this={form}>
        <Button onclick={() => form.submit()} class="text-xl mt-2 w-30 h-10 rounded bg-blue-500 text-white hover:bg-blue-600">Resend</Button>
    </form>
</div> 