<script lang="ts">
	import AuthLayout from '@shared/pages/auth/AuthLayout.svelte';

	const { children } = $props();
</script>

<AuthLayout>{@render children?.()}</AuthLayout>
