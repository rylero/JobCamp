<script lang="ts">
    import { onMount } from 'svelte';
    
    export let data: {
        isRunning: boolean;
        progress: number;
        currentSeed: number;
        results: any[];
        stats: any;
    };

    let jobId: string | null = null;
    let isRunning = data.isRunning;
    let progress = data.progress;
    let currentSeed = data.currentSeed;
    let isProcessing = false;
    let showResults = data.stats && !isRunning; // Only show results if we have stats and not running

    // Start polling immediately if there's already a running job
    onMount(() => {
        if (isRunning) {
            // Find the running job ID by polling the status endpoint
            findRunningJob();
        }
    });

    async function findRunningJob() {
        try {
            const response = await fetch('/api/lottery/status/running');
            const status = await response.json();
            if (status.jobId) {
                jobId = status.jobId;
                startPolling();
            }
        } catch (error) {
            console.error('Error finding running job:', error);
        }
    }

    async function runLottery() {
        const response = await fetch('/lottery?/runLottery', {
            method: 'POST'
        });
        const result = await response.json();
        
        if (result.success) {
            jobId = result.jobId;
            isRunning = true;
            showResults = false; // Hide results when starting new lottery
            startPolling();
        }
    }

    function startPolling() {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/lottery/status/${jobId}`);
                const status = await response.json();
                
                progress = status.progress;
                currentSeed = status.currentSeed;
                
                if (status.status === 'COMPLETED') {
                    isRunning = false;
                    isProcessing = true; // Show processing state
                    clearInterval(interval);
                    
                    // Wait a moment then refresh to show results
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else if (status.status === 'FAILED') {
                    isRunning = false;
                    isProcessing = false;
                    clearInterval(interval);
                    alert('Lottery failed: ' + status.error);
                }
            } catch (error) {
                console.error('Error polling lottery status:', error);
            }
        }, 500); // Poll every 500ms instead of 1000ms for faster updates
    }
</script>

<div class="bg-white rounded-lg shadow p-6">
    
    <!-- Run Lottery Section -->
    <div class="mb-6">
        <h3 class="font-semibold mb-2">Run Lottery</h3>
        {#if !isRunning && !isProcessing}
            <form method="POST" action="?/runLottery">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Run Lottery
                </button>
            </form>
        {:else if isProcessing}
            <div class="space-y-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: 100%"></div>
                </div>
                <p class="text-sm text-gray-600">
                    Processing results... Please wait
                </p>
            </div>
        {:else}
            <div class="space-y-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: {progress}%"></div>
                </div>
                <p class="text-sm text-gray-600">
                    Running lottery... {progress.toFixed(1)}% complete
                </p>
                <p class="text-sm text-gray-600">
                    Current seed: {currentSeed} / 5000
                </p>
            </div>
        {/if}
    </div>

    <!-- Results Statistics Section -->
    {#if showResults && data.stats}
        <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold">Lottery Results</h3>
                {#if data.stats.completedAt && data.stats.adminEmail}
                    <div class="text-sm text-gray-500">
                        Last run: {new Date(data.stats.completedAt).toLocaleString()} by {data.stats.adminEmail}
                    </div>
                {/if}
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{data.stats.totalStudents}</div>
                    <div class="text-sm text-gray-600">Total Students</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">{data.stats.firstChoice}</div>
                    <div class="text-sm text-gray-600">1st Choice</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-yellow-600">{data.stats.secondChoice}</div>
                    <div class="text-sm text-gray-600">2nd Choice</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-orange-600">{data.stats.thirdChoice}</div>
                    <div class="text-sm text-gray-600">3rd Choice</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-red-600">{data.stats.notPlaced}</div>
                    <div class="text-sm text-gray-600">Not Placed</div>
                </div>
            </div>
        </div>
    {/if}
</div>
