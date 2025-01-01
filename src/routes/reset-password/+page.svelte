<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { Input } from "$lib/components/ui/input";
    import Label from "$lib/components/ui/label/label.svelte";
    import { enhance } from "$app/forms";

    let { data, form } = $props();
</script>
{#if (data.waiting == 0 && !form) || (form && form.waiting == 0)}
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between items-center gap-4 py-20 px-20 sm:border-2 sm:rounded-lg sm:shadow-2xl">
    <form method="POST" action="?/send" use:enhance>
        <Label class="text-lg">Email</Label>
        <Input name="email" type="email" />
        {#if form && form.msg}<p class="text-red-500">{form.msg}</p>{/if}
        <Button type="submit" class="text-xl mt-2 px-2 h-10 rounded bg-blue-500 text-white hover:bg-blue-600">Send Forgot Password Email</Button>
    </form>
</div>
{:else if (data.waiting == 1 && !form) || (form && form.waiting == 1)}
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between items-center gap-4 py-10 px-10 sm:border-2 sm:rounded-lg sm:shadow-2xl">
    <h1 class="text-xl text-center">Check your inbox for an password reset link</h1>
    {#if form && form.msg}<p class="text-red-500">{form.msg}</p>{/if}
</div> 
{:else}
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between items-center gap-4 py-10 px-10 sm:border-2 sm:rounded-lg sm:shadow-2xl">
    <h1 class="text-xl text-center">Reset Password</h1>
    {#if form && form.msg}<p class="text-red-500">{form.msg}</p>{/if}
    <form method="POST" action="?/submit" use:enhance>
        <input type="hidden" class="hidden" name="code" value={form?.code} />
        <input type="hidden" class="hidden" name="uid" value={form?.userId} />
        <Label class="text-lg">Enter New Password:</Label>
        <Input name="password" />
        <Button type="submit" class="text-xl mt-2 w-30 h-10 rounded bg-blue-500 text-white hover:bg-blue-600">Resend</Button>
    </form>
</div> 
{/if}