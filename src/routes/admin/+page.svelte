<script lang="ts">
    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";

    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";

    import {Tipex} from "@friendofsvelte/tipex";
    import Button from "$lib/components/ui/button/button.svelte";
    let htmlContent = '';
</script>

<div class="w-screen h-screen flex">
    <!-- Left -->
    <ScrollArea class="w-40 h-full">
        <Button>Students</Button>
    </ScrollArea>

    <!-- Right -->
    <ScrollArea class="h-full w-full">
        <Tipex {htmlContent}
            displayDefaultControls
            floatingMenu
            className="border border-neutral-200 m-8 min-h-96 h-[calc(100vh-4rem)]" />
    </ScrollArea>
</div>