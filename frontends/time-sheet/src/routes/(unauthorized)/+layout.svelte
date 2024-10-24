<script lang="ts">
	import { AuthLayout } from '@shared/ui/pages';

	const { children } = $props();
</script>

<AuthLayout>{@render children?.()}</AuthLayout>
