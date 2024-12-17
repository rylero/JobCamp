<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import User from "lucide-svelte/icons/user";
    import LogOut from "lucide-svelte/icons/log-out";
    import Settings from "lucide-svelte/icons/settings";
    import { enhance } from "$app/forms";
</script>

<nav class="w-screen h-20 fixed top-0 left-0 bg-gray-800 flex flex-row justify-between items-center px-5 z-50">
    <h1 class="ml-4 text-2xl text-white">JobCamp</h1>

    <form id="logOutForm" method="POST" action="?/logOut" use:enhance>
        <Button type="submit" class="nav-dropdown-button">
            <LogOut class="mr-2 h-4 w-4" />
            <span>Log out</span>
        </Button>
    </form>
</nav>