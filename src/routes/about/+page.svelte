<script lang="ts">
    import content from "./aboutContent.json";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { goto } from "$app/navigation";

    const { data } = $props();
    const { isHost, loggedIn } = data;
</script>

<Navbar isHost={isHost} loggedIn={loggedIn} />

<div class="flex flex-col w-full items-center mt-24">
  <div class="flex flex-col justify-center items-center my-3 mx-2">
      <h1 class="text-3xl">About JobCamp</h1>
      <a href="mailto:admin@jobcamp.org" class="text-md underline text-blue-500">admin@jobcamp.org</a>
  </div>

  <div class="flex justify-center items-center my-2 mx-4 flex-col md:flex-row">
      <div class="w-96 text-center px-1 text-xl">{ content.p1 }</div>
      <figure class="w-96 px-1">
          <img src={content.img1}>
          <figcaption class="text-sm font-thin italic text-center">{ content.caption1 }</figcaption>
      </figure>
  </div>

  <hr class="w-[400px] my-2">

  <div class="flex justify-center items-center my-2 mx-4 flex-col md:flex-row">
      <figure class="w-96 px-1">
          <img src={content.img2} >
          <figcaption class="text-sm font-thin italic text-center">{ content.caption2 }</figcaption>
      </figure>
      <p class="w-96 text-center text-xl px-1">{ content.p2 }</p>
  </div>

  <hr class="w-[400px] my-2">

  <div class="flex justify-center items-center my-2 mx-4 flex-col md:flex-row">
      <p class="w-96 text-center text-xl px-1">{ content.p3 }</p>
      <figure class="w-96 px-1">
          <img src={content.img3} >
          <figcaption class="text-sm font-thin italic text-center">{ content.caption3 }</figcaption>
      </figure>
  </div>

  <hr class="w-[400px] my-2">

  <div class="w-[48rem] max-w-[100vw] flex justify-center items-center my-2 mx-4">
      <h1 class="text-xl text-xl text-center">{ content.blurb1 }</h1>
  </div>
  <div class="flex flex-row justify-center mb-10 flex-col md:flex-row">
      <div class="flex justify-center items-center mx-4 flex-col md:flex-row">
          <p class="w-96 px-1 whitespace-pre">{ content.companiesCol1 }</p>
      </div>
      <div class="flex justify-center items-center mx-4 flex-col md:flex-row">
          <p class="w-96 px-1 whitespace-pre">{ content.companiesCol2 }</p>
      </div>
  </div>
</div>