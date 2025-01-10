<script lang="ts">
    import Company from "./Company.svelte";
    import Student from "./Student.svelte";

    let { data } = $props();
</script>

{#if data.isCompany}
<Company data={data} />
{:else}
<Student />
{/if}