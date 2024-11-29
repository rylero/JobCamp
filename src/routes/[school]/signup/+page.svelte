<script lang="ts">
    import { goto } from "$app/navigation";

    const studentSignup = () => {
        goto("/signup/student");
    }

    const companySignup = () => {
        goto("/signup/company");
    }
</script>

<div class="flex flex-col w-96 h-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center gap-8 border-4 bg-slate-100">
    <h1 class="text-4xl">Sign Up</h1>
    <div class="flex flex-col justify-center items-center gap-2">
        <button onclick={studentSignup} class="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-600">Student</button>
        <button onclick={companySignup} class="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-600">Company</button>
    </div>
    <a href="/login" class="underline text-blue-500">Do you want to login?</a>
</div>