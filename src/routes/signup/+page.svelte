<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    const studentSignup = () => {
        goto("/signup/student");
    }

    const companySignup = () => {
        goto("/signup/company");
    }
</script>

<Navbar isHost={false} loggedIn={false} />

<div class="w-full min-h-screen flex flex-col gap-8 justify-center items-center">
    <div class="flex flex-col justify-between items-center gap-16 py-10 px-10 border-2 rounded-lg shadow-2xl">
        <h1 class="text-5xl">Sign Up</h1>
        <div class="flex flex-col justify-center items-center gap-2">
            <Button class="w-32 text-lg" onclick={companySignup}>Company</Button>
            <Button class="w-32 text-lg" onclick={studentSignup}>Student*</Button>
            <span class="text-sm italic w-40 text-center">*Student accounts from last year will not work.</span>
        </div>
        <a href='/login' class="text-lg">I already have an account</a>
    </div>
</div>