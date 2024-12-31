<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import PositionForm from "../PositionForm.svelte";

    let props = $props();
</script>

<Navbar loggedIn={true} isHost={true} />

<PositionForm data={props.data} formTitle="Edit Position" buttonName="Save" />

<div class="h-2"></div>