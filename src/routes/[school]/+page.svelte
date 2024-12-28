<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { redirect } from "@sveltejs/kit";
    import JobCampBanner from "$lib/assets/jobcampbanner.jpg";

    const { data } = $props();
    const { schoolData, loggedIn } = data;

    if (schoolData == undefined) {
        redirect(302, "/");
    }
</script>

<nav class="w-screen h-20 fixed top-0 left-0 bg-gray-800 flex flex-row justify-between items-center text-white">
    <h1 class="ml-4 text-2xl">{schoolData.name}</h1>
    <div class="flex flex-row gap-4 mr-4">
        {#if !loggedIn}
            <Button href="/signup" variant="secondary" class="bg-white text-xl">Sign Up</Button>
            <Button href="/login" variant="secondary" class="bg-white text-xl">Login</Button>
        {:else}
            <Button href="/dashboard" variant="secondary" class="bg-white text-xl">Dashboard</Button>
        {/if}
    </div>
</nav>

<div class="w-screen h-screen bg-cover bg-center flex flex-col justify-center items-center" style="background-image: url({JobCampBanner});">
    <h1 class="text-8xl md:text-9xl text-black px-4">JobCamp</h1>
    <Button class="text-2xl mt-8 py-6 shadow-2xl" href={loggedIn ? "/dashboard" : "/signup"}>{ loggedIn ? "Dashboard" : "Sign Up" }</Button>
</div>