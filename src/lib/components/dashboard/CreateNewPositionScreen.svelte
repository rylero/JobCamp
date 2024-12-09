<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "../ui/button";
    import { Input } from "../ui/input";
    import { Label } from "../ui/label";
    import { Textarea } from "../ui/textarea";
    import { careers } from "$lib/appconfig";

    let { userData } = $props();
</script>

<div class="w-full min-h-[calc(100vh-5rem)] flex justify-center items-center">
    <form method="POST" action="?/createPosition" class="md:border-2 px-10 py-8 rounded-lg w-[700px] mx-5 flex flex-col gap-4 items-center justify-center" use:enhance>
        <h1 class="text-xl">Create New Position</h1>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="title">Title</Label>
            <Input id="title" />
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="career">Career</Label>
            <select id="career" class="border rounded-md px-2 py-2">
                {#each careers as career}
                    <option value="career">{career}</option>
                {/each}
            </select>
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="sumamry">Summary</Label>
            <Textarea id="summary" />
        </div>
        
        <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
            <Label for="name" class="w-28">Full Name</Label>
            <Input class="w-full" id="name" value={userData.name} />
        </div>

        <div class="flex justify-between items-center w-full max-w-sm gap-1.5">
            <Label for="email" class="w-28">Email</Label>
            <Input class="w-full" id="email" value={userData.email} />
        </div>

        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="address">Address</Label>
            <Textarea id="address" />
        </div>
        
        <div class="flex w-full max-w-sm justify-between gap-3">
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="instructions">Instructions For Students</Label>
                <Textarea id="instructions" placeholder="Dress code, specific meeting location, parking information, etc." class="h-full" />
            </div>
            <div class="flex flex-col gap-1.5">
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="arrival">Arrival</Label>
                    <Input class="w-max" id="arrival" type="time" />
                </div>
                <div class="flex w-full max-w-md flex-col gap-1.5">
                    <Label for="release">Release</Label>
                    <Input class="w-max" id="release" type="time" />
                </div>
            </div>
        </div>
        

        <div class="w-full flex justify-center">
            <Button class="w-28 py-4 text-lg">Create</Button>
        </div>
    </form>
</div>