<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { redirect } from "@sveltejs/kit";
    import JobCampBanner from "$lib/assets/jobcampbanner.jpg";
    import Navbar from "$lib/components/navbar/Navbar.svelte";

    const { data } = $props();
    const { isHost, loggedIn } = data;
</script>


<Navbar isHost={isHost} loggedIn={loggedIn} />

<div class="w-screen h-screen bg-cover bg-center flex flex-col justify-center items-center" style="background-image: url({JobCampBanner});">
    <h1 class="text-7xl md:text-9xl text-black px-4">JobCamp</h1>
    <Button class="text-2xl mt-8 py-6 shadow-2xl" href={loggedIn ? "/dashboard" : "/signup"}>{ loggedIn ? "Dashboard" : "Sign Up" }</Button>
</div>