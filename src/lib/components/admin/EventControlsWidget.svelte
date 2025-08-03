<script lang="ts">
    import { Switch } from "$lib/components/ui/switch";
    import { Label } from "$lib/components/ui/label";

    // Event control states
    let eventEnabled = $state(false);
    let companyAccountsEnabled = $state(false);
    let studentAccountsEnabled = $state(false);
    let studentSignupsEnabled = $state(false);
    let lotteryPublished = $state(false);

    // Handle control changes (placeholder for future backend integration)
    function handleControlChange(control: string, value: boolean) {
        console.log(`${control} changed to: ${value}`);
        // TODO: Add backend integration in future commits
    }
</script>

<div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4">Event Controls</h2>
    
    <div class="space-y-4">
        <!-- Event Control -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <Switch 
                    bind:checked={eventEnabled}
                    on:click={() => handleControlChange('event', eventEnabled)}
                />
                <Label class="text-base font-medium">Event</Label>
            </div>
            <span class="text-sm text-gray-500">
                {eventEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>

        <!-- Company Accounts Control -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <Switch 
                    bind:checked={companyAccountsEnabled}
                    on:click={() => handleControlChange('companyAccounts', companyAccountsEnabled)}
                />
                <Label class="text-base font-medium">Company Accounts</Label>
            </div>
            <span class="text-sm text-gray-500">
                {companyAccountsEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>

        <!-- Student Accounts Control -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <Switch 
                    bind:checked={studentAccountsEnabled}
                    on:click={() => handleControlChange('studentAccounts', studentAccountsEnabled)}
                />
                <Label class="text-base font-medium">Student Accounts</Label>
            </div>
            <span class="text-sm text-gray-500">
                {studentAccountsEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>

        <!-- Student Signups Control -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <Switch 
                    bind:checked={studentSignupsEnabled}
                    on:click={() => handleControlChange('studentSignups', studentSignupsEnabled)}
                />
                <Label class="text-base font-medium">Student Signups</Label>
            </div>
            <span class="text-sm text-gray-500">
                {studentSignupsEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>

        <!-- Lottery Published Control -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <Switch 
                    bind:checked={lotteryPublished}
                    on:click={() => handleControlChange('lotteryPublished', lotteryPublished)}
                />
                <Label class="text-base font-medium">Lottery Published</Label>
            </div>
            <span class="text-sm text-gray-500">
                {lotteryPublished ? 'Published' : 'Hidden'}
            </span>
        </div>
    </div>

    <!-- Status Summary -->
    <div class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Active Controls:</span>
            <span class="font-medium text-blue-600">
                {[eventEnabled, companyAccountsEnabled, studentAccountsEnabled, studentSignupsEnabled, lotteryPublished].filter(Boolean).length}/5
            </span>
        </div>
    </div>
</div> 