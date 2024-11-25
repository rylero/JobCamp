<script lang="ts">
    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";

    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import Button from "$lib/components/ui/button/button.svelte";

    import { Tipex } from "@friendofsvelte/tipex";
    let htmlContent = '';

    type Query = { 
        [index : string] : { 
            selected : boolean 
        }
    };

    let query : Query = $state({
        "students": {
            selected: false,
        },
        "hosts": {
            selected: false,
        },
        "positions": {
            selected: false,
        }
    });

    function selectQueryType(queryType: string) {
        // set all to false
        query["students"].selected = false;
        query["hosts"].selected = false;
        query["positions"].selected = false;

        // set desired to true
        query[queryType].selected = true;
    }
</script>

<div class="w-screen h-screen flex">
    <!-- Left -->
    <ScrollArea class="w-80 h-full pl-8 pt-8">
        <Button variant={ query.students.selected ? "default" : "outline" } class="w-28" on:click={() => selectQueryType("students")}>Students</Button>
        <Separator class="my-2" />
        <Button variant={ query.hosts.selected ? "default" : "outline"} class="w-28" on:click={() => selectQueryType("hosts")}>Hosts</Button>
        <Separator class="my-2" />
        <Button variant={ query.positions.selected ? "default" : "outline"} class="w-28" on:click={() => selectQueryType("positions")}>Positions</Button>
    </ScrollArea>

    <!-- Right -->
    <ScrollArea class="h-full w-full">
        <div class="h-full w-full flex flex-col align-middle">
            <Tipex {htmlContent}
                displayDefaultControls
                floatingMenu
                className="border border-neutral-200 mx-8 mt-8 mb-6 min-h-96 h-[calc(100vh-8rem)]" />
            <Button class="w-48 mx-auto">Send</Button>
        </div>
    </ScrollArea>
</div>