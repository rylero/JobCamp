<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import JobCampBanner from "$lib/assets/jobcampbanner.jpg";
  import Navbar from "$lib/components/navbar/Navbar.svelte";

  const { data } = $props();
  const { isHost, loggedIn, isAdmin } = data;
</script>

<Navbar {isHost} {loggedIn} {isAdmin} />

<div
  class="w-screen h-screen bg-cover bg-center flex flex-col justify-center items-center"
  style="background-image: url({JobCampBanner});"
>
  <h1 class="text-7xl md:text-9xl text-black px-4">JobCamp</h1>
  <Button
    class="text-2xl mt-8 py-6 shadow-2xl"
    href={loggedIn ? "/dashboard" : "/signup"}
    >{loggedIn ? "Dashboard" : "Sign Up"}</Button
  >
  <!-- <Button variant="link" href="/lghs/view-companies" class="text-2xl text-black mt-5">View Companies</Button> -->
</div>
