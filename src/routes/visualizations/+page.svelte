<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import { Button } from "$lib/components/ui/button";
    import { onMount } from 'svelte';
    import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';

    let { data } = $props();
    let chartCanvas: HTMLCanvasElement;
    let chart: Chart | null = null;
    let selectedVisualization = $state('lottery');

    // Available visualizations
    const visualizations = [
        { value: 'lottery', label: 'Lottery Results', description: 'Student placement distribution by choice preference' },
        { value: 'company', label: 'Company Analytics', description: 'Company participation and position statistics' },
        { value: 'student', label: 'Student Demographics', description: 'Student registration and grade distribution' },
        { value: 'timeline', label: 'Event Timeline', description: 'Registration and lottery timeline analysis' }
    ];

    // Register Chart.js components
    Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

    function createChart() {
        if (!chartCanvas || !data.lotteryStats) {
            return;
        }

        // Destroy existing chart if it exists
        if (chart) {
            chart.destroy();
            chart = null;
        }

        const ctx = chartCanvas.getContext('2d');
        if (!ctx) {
            return;
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1st Choice', '2nd Choice', '3rd Choice', '4th Choice', '5th Choice', '6th Choice', '7th Choice', '8th Choice', '9th Choice', '10th Choice', 'Not Placed'],
                datasets: [
                    {
                        label: 'Students',
                        data: [
                            data.lotteryStats.firstChoice,
                            data.lotteryStats.secondChoice,
                            data.lotteryStats.thirdChoice,
                            data.lotteryStats.fourthChoice,
                            data.lotteryStats.fifthChoice,
                            data.lotteryStats.sixthChoice,
                            data.lotteryStats.seventhChoice,
                            data.lotteryStats.eighthChoice,
                            data.lotteryStats.ninthChoice,
                            data.lotteryStats.tenthChoice,
                            data.lotteryStats.notPlaced
                        ],
                        backgroundColor: [
                            '#10b981', // Green for 1st choice
                            '#f59e0b', // Yellow for 2nd choice
                            '#f97316', // Orange for 3rd choice
                            '#8b5cf6', // Purple for 4th choice
                            '#3b82f6', // Blue for 5th choice
                            '#ec4899', // Pink for 6th choice
                            '#06b6d4', // Cyan for 7th choice
                            '#84cc16', // Lime for 8th choice
                            '#fbbf24', // Amber for 9th choice
                            '#f97316', // Orange for 10th choice
                            '#ef4444'  // Red for not placed
                        ],
                        borderColor: [
                            '#059669',
                            '#d97706',
                            '#ea580c',
                            '#7c3aed',
                            '#2563eb',
                            '#db2777',
                            '#0891b2',
                            '#65a30d',
                            '#d97706',
                            '#ea580c',
                            '#dc2626'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Lottery Results - Choice Distribution',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `${context.parsed.y} students (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Students'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Choice Level'
                        }
                    }
                }
            }
        });
    }

    // Create chart when component mounts and data is available
    onMount(() => {
        setTimeout(() => {
            createChart();
        }, 0);
    });

    // Cleanup on unmount
    onMount(() => {
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    });
</script>

<Navbar loggedIn={data.loggedIn} isHost={data.isHost} isAdmin={data.isAdmin} />

<div class="h-24"></div>

<div class="container mx-auto px-6 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Data Visualizations</h1>
        <p class="text-gray-600">Interactive analytics and insights from your JobCamp data.</p>
    </div>

    <!-- Visualization Selector -->
    <div class="mb-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Select Visualization</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {#each visualizations as viz}
                <button
                    class="p-4 border rounded-lg text-left transition-colors {selectedVisualization === viz.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}"
                    onclick={() => selectedVisualization = viz.value}
                >
                    <div class="font-semibold text-gray-900">{viz.label}</div>
                    <div class="text-sm text-gray-600 mt-1">{viz.description}</div>
                    {#if selectedVisualization === viz.value}
                        <div class="text-xs text-blue-600 mt-2">✓ Selected</div>
                    {/if}
                </button>
            {/each}
        </div>
    </div>

    {#if selectedVisualization === 'lottery' && data.lotteryStats}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Chart -->
            <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Choice Distribution</h2>
                <div class="h-96">
                    <canvas bind:this={chartCanvas} width="800" height="400"></canvas>
                </div>
            </div>

            <!-- Summary Stats -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Summary</h2>
                <div class="space-y-4">
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">{data.lotteryStats.firstChoice}</div>
                        <div class="text-sm text-green-600">Got 1st Choice</div>
                        <div class="text-xs text-gray-500">
                            {((data.lotteryStats.firstChoice / data.lotteryStats.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>
                    
                    <div class="text-center p-4 bg-yellow-50 rounded-lg">
                        <div class="text-2xl font-bold text-yellow-600">{data.lotteryStats.secondChoice}</div>
                        <div class="text-sm text-yellow-600">Got 2nd Choice</div>
                        <div class="text-xs text-gray-500">
                            {((data.lotteryStats.secondChoice / data.lotteryStats.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>
                    
                    <div class="text-center p-4 bg-orange-50 rounded-lg">
                        <div class="text-2xl font-bold text-orange-600">{data.lotteryStats.thirdChoice}</div>
                        <div class="text-sm text-orange-600">Got 3rd Choice</div>
                        <div class="text-xs text-gray-500">
                            {((data.lotteryStats.thirdChoice / data.lotteryStats.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>
                    
                    <div class="text-center p-4 bg-red-50 rounded-lg">
                        <div class="text-2xl font-bold text-red-600">{data.lotteryStats.notPlaced}</div>
                        <div class="text-sm text-red-600">Not Placed</div>
                        <div class="text-xs text-gray-500">
                            {((data.lotteryStats.notPlaced / data.lotteryStats.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Stats -->
        <div class="mt-8 bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Detailed Statistics</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div class="text-center">
                    <div class="text-lg font-semibold">{data.lotteryStats.totalStudents}</div>
                    <div class="text-sm text-gray-600">Total Students</div>
                </div>
                <div class="text-center">
                    <div class="text-lg font-semibold text-green-600">{data.lotteryStats.firstChoice + data.lotteryStats.secondChoice + data.lotteryStats.thirdChoice}</div>
                    <div class="text-sm text-gray-600">Top 3 Choices</div>
                </div>
                <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{data.lotteryStats.totalStudents - data.lotteryStats.notPlaced}</div>
                    <div class="text-sm text-gray-600">Successfully Placed</div>
                </div>
                <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{((data.lotteryStats.firstChoice / data.lotteryStats.totalStudents) * 100).toFixed(1)}%</div>
                    <div class="text-sm text-gray-600">1st Choice Rate</div>
                </div>
                <div class="text-center">
                    <div class="text-lg font-semibold text-orange-600">{(((data.lotteryStats.totalStudents - data.lotteryStats.notPlaced) / data.lotteryStats.totalStudents) * 100).toFixed(1)}%</div>
                    <div class="text-sm text-gray-600">Placement Rate</div>
                </div>
                <div class="text-center">
                    <div class="text-lg font-semibold text-red-600">{((data.lotteryStats.notPlaced / data.lotteryStats.totalStudents) * 100).toFixed(1)}%</div>
                    <div class="text-sm text-gray-600">Not Placed Rate</div>
                </div>
            </div>
        </div>
    {:else if selectedVisualization === 'lottery' && !data.lotteryStats}
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">No Lottery Data Available</h2>
            <p class="text-gray-600 mb-4">
                No lottery results are currently available. Run the lottery first to see the analysis.
            </p>
            <Button href="/lottery" variant="default">
                Go to Lottery
            </Button>
        </div>
    {:else}
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Coming Soon</h2>
            <p class="text-gray-600 mb-4">
                The {visualizations.find(v => v.value === selectedVisualization)?.label} visualization is under development and will be available soon.
            </p>
        </div>
    {/if}
</div> 