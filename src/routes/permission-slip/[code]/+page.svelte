<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import type { PageData } from "./$types";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
 
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    const { form, errors, enhance } = superForm(data.form, {
        resetForm: false,
		clearOnSubmit: 'none'
    });
</script>

<div class="mt-32 mb-5 w-full flex justify-center items-center">
    <form method="POST" class="z-0 relative md:border-2 px-10 py-8 md:rounded-lg w-[700px] mx-5 flex flex-col gap-4 items-center justify-center" use:enhance>
        <h1 class="text-4xl">Permission Slip</h1>
        <p>This form is required for every student participating in Job Shadow Day on March 10, 2025.<br>
            It includes:<br>
            - Contact Information<br>
            - Parent/Guardian Permission<br>
            - Medical Treatment Authorization<br>
            - Liability and Photo/Video Release</p>

            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="parentName">Parent/Guardian first and last name</Label>
                <Input name="parentName" id="parentName" bind:value={$form.parentName} />
                {#if $errors.parentName}<span class="text-sm text-red-500">{$errors.parentName}</span>{/if}
            </div>

            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="phoneNumber">Parent/Guardian phone number (reachable on March 10)</Label>
                <Input name="phoneNumber" id="phoneNumber" bind:value={$form.phoneNumber} />
                {#if $errors.phoneNumber}<span class="text-sm text-red-500">{$errors.phoneNumber}</span>{/if}
            </div>

            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="studentFirstName">Student first name</Label>
                <Input name="studentFirstName" id="studentFirstName" bind:value={$form.studentFirstName} />
                {#if $errors.studentFirstName}<span class="text-sm text-red-500">{$errors.studentFirstName}</span>{/if}
            </div>

            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="studentLastName">Student last name</Label>
                <Input name="studentLastName" id="studentLastName" bind:value={$form.studentLastName} />
                {#if $errors.studentLastName}<span class="text-sm text-red-500">{$errors.studentLastName}</span>{/if}
            </div>

            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="physicalRestrictions">Does your student have any physical limitations to participate in Job Shadow Day? If so, please explain.</Label>
                <Input name="physicalRestrictions" id="physicalRestrictions" bind:value={$form.physicalRestrictions} />
                {#if $errors.physicalRestrictions}<span class="text-sm text-red-500">{$errors.physicalRestrictions}</span>{/if}
            </div>

            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="dietaryRestrictions">Does your student have any dietary restrictions? If so, please explain.</Label>
                <Input name="dietaryRestrictions" id="dietaryRestrictions" bind:value={$form.dietaryRestrictions} />
                {#if $errors.dietaryRestrictions}<span class="text-sm text-red-500">{$errors.dietaryRestrictions}</span>{/if}
            </div>

            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="emergencyTreatment">In case of emergency, I give permission for my child to receive necessary medical treatment. 
                    <br>
                    Please provide your digital signature by typing your first and last name.</Label>
                <Input name="emergencyTreatment" id="emergencyTreatment" bind:value={$form.emergencyTreatment} />
                {#if $errors.emergencyTreatment}<span class="text-sm text-red-500">{$errors.emergencyTreatment}</span>{/if}
            </div>

            <hr class="w-full border border-black my-4">

            <div class="flex w-full flex-col gap-1.5">
                <p>Parents, please read through the expectations of Job Shadow Day to help your student prepare and participate to maximize the opportunity.</p>
                <p class="font-bold">Students Agree to:</p>
                <ul class="list-disc ml-8">
                    <li>Attend a mandatory orientation session during TUTORIAL in the theater on Feb 28, 2025.</li>
                    <li>Email their job shadow host by March 6th, to make an introduction and confirm attendance for job shadow day on March 10th.</li>
                    <li>Attend any job shadow position to which they are assigned.</li>
                    <li>Secure transportation to/from job shadow position.</li>
                    <li>Abide by dress and behavior expectations befitting a LGHS student, including being on time.</li>
                    <li>Contact job shadow host if an emergency situation arises and can no longer attend.</li>
                    <li>Write a thank-you email to the host and complete a Job Shadow survey by March 18.</li>
                </ul>
                <Label class="text-lg flex items-center">
                    <input type="checkbox" class="mr-3 w-5 h-5" bind:checked={$form.studentAgreement} />My Student and I have read over the following expectations</Label>
                {#if $errors.studentAgreement}<span class="text-sm text-red-500">{$errors.studentAgreement}</span>{/if}
            </div>

            <hr class="w-full border border-black my-4">

            <p>In consideration for being permitted to participate in the Job Shadow program, the participant ("Student") and parent/legal guardian each hereby agree as follows:</p>
            <ul class="list-disc ml-8 font-bold">
                <li>Student is voluntarily participating in the Job Shadow program sponsored by the Los Gatos High School Home & School Club. Parent/legal guardian gives permission for the student to attend job shadow assignment.</li>

                <li>We (the student and parent/legal guardian) in consideration for the Los Gatos/Saratoga Union High School District (“District”) permitting my child to participate in the Job Shadow program, the undersigned on behalf of student, student heirs, executors, administrators, and assigns, voluntarily releases, discharges, waives any and all actions or causes of action for personal injury, property damage, or wrongful death (including attorney’s fees and costs) arising out of or in connection with the student’s time at the Job Shadow program sponsored by the Los Gatos High School Home & School Club, or any activity incidental thereto, whether or not such injuries, death or damages are caused by the negligence, active or passive, of Los Gatos High School, Los Gatos/Saratoga Union High School District, Los Gatos Home & School Club, Parent Volunteers and/or the job shadow hosting companies.</li>
                    
                <li>The undersigned further agrees that in the event that any claim for personal injury, property damage or wrongful death shall be prosecuted against the Los Gatos High School Home & School Club, Los Gatos High School, Los Gatos/Saratoga Union High School District, Parent Volunteers and/or the job shadow hosting companies, in connection with the student’s time at the Job Shadow program, or any activity incidental thereto, the undersigned shall indemnify and save harmless the Los Gatos High School Home & School Club, Parent Volunteers, Los Gatos High School, the Los Gatos/Saratoga Union High School District, and the job shadow hosting companies, their Board of Directors, officers, representatives, agents, employees and volunteers, from any liability or claim for damages which may arise as a result of Student's participation in the Job Shadow program from any and all such claims or causes of action, by whomever or wherever made, without regard to whether said liability or claim is based on any alleged breach of duty arising in contract, tort or statute and regardless of the forum in which it might be brought.</li>
                    
                <li>The undersigned further agrees to assume any and all risks associated with participation in the Job Shadow program in connection with the student’s time at the Job Shadow program, or any activity incidental thereto, and covenants not to sue any and all of the persons and agencies mentioned above.</li>
                    
                <li>Photos and videos may be taken during Job Shadow Day. This media may be used to promote JobCamp, Los Gatos High School College and Career Center, or the hosting company's community relations. If you would like to decline permission, please email admin@jobcamp.org.</li>
            </ul>
        
            <div class="flex w-full flex-col gap-1.5">
                <Label class="text-lg" for="liability">Parent/Guardian, agree to the above liability and release by typing your name.</Label>
                <Input name="liability" id="liability" bind:value={$form.liability} />
                {#if $errors.liability}<span class="text-sm text-red-500">{$errors.liability}</span>{/if}
            </div>

            <div class="flex justify-between items-center w-full gap-1.5">
                <Label class="text-lg" for="liabilityDate">Date</Label>
                <Input bind:value={$form.liabilityDate} class="w-max" name="liabilityDate" id="liabilityDate" type="time" />
            </div>
            {#if $errors.liabilityDate}<span class="text-sm text-red-500 text-right">{$errors.liabilityDate}</span>{/if}

        <button type="submit" class="my-2 p-4 py-2 rounded-md shadow-xl bg-blue-500 text-white hover:bg-blue-600">Complete</button>
    </form>
</div>