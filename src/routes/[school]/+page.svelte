<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { redirect } from "@sveltejs/kit";
    import JobCampBanner from "$lib/assets/jobcampbanner.jpg";

    const { data } = $props();
    const { schoolData } = data;

    if (schoolData == undefined) {
        redirect(302, "/");
    }
</script>

<nav class="w-screen h-20 fixed top-0 left-0 bg-gray-800 flex flex-row justify-between items-center text-white">
    <h1 class="ml-4 text-2xl">{schoolData.name}</h1>
    <div class="flex flex-row gap-4 mr-4">
        <Button href="/signup" variant="secondary" class="bg-white text-xl">Sign Up</Button>
        <Button href="/login" variant="secondary" class="bg-white text-xl">Login</Button>
    </div>
</nav>

<div class="w-screen h-screen bg-cover bg-center flex flex-col justify-center items-center" style="background-image: url({JobCampBanner});">
    <h1 class="text-8xl md:text-9xl font-bold text-3D text-white">{schoolData.webAddr.toUpperCase()}</h1>
    <h1 class="text-8xl md:text-9xl font-semibold text-3D text-white">JobCamp</h1>
    <Button class="text-2xl mt-8 py-6 shadow-2xl" href="/signup">Sign Up Now</Button>
</div>

<style>
    .text-3D {
        text-shadow: 1px 1px 1px #919191,
        1px 2px 1px #919191,
        1px 3px 1px #919191,
        1px 4px 1px #919191,
        1px 5px 1px #919191,
        1px 6px 1px #919191,
        1px 7px 1px #919191,
        1px 8px 1px #919191,
        1px 9px 1px #919191,
        1px 10px 1px #919191,
    1px 18px 6px rgba(16,16,16,0.4),
    1px 22px 10px rgba(16,16,16,0.2),
    1px 25px 35px rgba(16,16,16,0.2),
    1px 30px 60px rgba(16,16,16,0.4);
    }
</style>