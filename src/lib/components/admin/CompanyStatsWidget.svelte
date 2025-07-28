<script lang="ts">
    export let stats: {
        companiesCreated: number;
        companiesWithoutPositions: number;
        companiesNotLoggedIn: number;
        totalPositions: number;
        totalSlots: number;
    };
</script>

<div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4">Company Statistics</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{stats.companiesCreated}</div>
            <div class="text-sm text-gray-600">Companies Created</div>
        </div>
        <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{stats.companiesWithoutPositions}</div>
            <div class="text-sm text-gray-600">No Positions</div>
        </div>
        <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{stats.companiesNotLoggedIn}</div>
            <div class="text-sm text-gray-600">Not Logged In</div>
        </div>
        <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{stats.totalPositions}</div>
            <div class="text-sm text-gray-600">Total Positions</div>
        </div>
        <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{stats.totalSlots}</div>
            <div class="text-sm text-gray-600">Total Slots</div>
        </div>
    </div>
</div>