<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import User from "lucide-svelte/icons/user";
    import LogOut from "lucide-svelte/icons/log-out";
    import Settings from "lucide-svelte/icons/settings";
</script>

<nav class="w-screen h-20 fixed top-0 left-0 bg-gray-800 flex flex-row justify-between items-center px-5">
    <h1 class="ml-4 text-2xl text-white">JobCamp</h1>

    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <Button variant="outline"><User />Profile</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Item>
                <button class="nav-dropdown-button">
                    <Settings class="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
                <button type="submit" form="logOutForm" class="nav-dropdown-button">
                    <LogOut class="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </button>
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</nav>
<form id="logOutForm" method="POST"></form>

<style>
    .nav-dropdown-button:hover {
        cursor: pointer;
    }

    .nav-dropdown-button {
        all: unset;
        display: flex;
        justify-content: start;
        align-items: center;
    }
</style>