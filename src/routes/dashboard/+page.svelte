<script lang="ts">
    import Company from "./Company.svelte";

    let { data } = $props();
</script>

<Company data={data} />