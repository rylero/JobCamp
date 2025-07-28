<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import StudentStatsWidget from "$lib/components/admin/StudentStatsWidget.svelte";
    import CompanyStatsWidget from "$lib/components/admin/CompanyStatsWidget.svelte";
    
    export let data;
    const { isAdmin, loggedIn, isHost, studentStats, companyStats} = data;
</script>

<Navbar {isAdmin} {loggedIn} {isHost}/>

<div class="w-full mt-28 flex flex-col items-center">
    <div class="max-w-6xl w-full px-4">
        <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudentStatsWidget stats={studentStats} />
            <CompanyStatsWidget stats={companyStats} />
        </div>
    </div>
</div>
