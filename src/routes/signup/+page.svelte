<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";

    const studentSignup = () => {
        goto("/signup/student");
    }

    const companySignup = () => {
        goto("/signup/company");
    }
</script>

<div class="w-full min-h-screen flex flex-col gap-8 justify-center items-center">
    <h1 class="text-5xl">Sign Up</h1>
    <div class="flex flex-col justify-center items-center gap-2">
        <Button class="w-32 text-lg" onclick={studentSignup}>Student</Button>
        <Button class="w-32 text-lg" onclick={companySignup}>Company</Button>
    </div>
    <Button variant="link" href={`/login`} class="text-lg">I already have an account</Button>
</div>