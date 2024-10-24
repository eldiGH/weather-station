<script lang="ts">
	import { AuthLayout } from '@shared/ui/pages';
	import type { LayoutProps } from '@shared/ui/types';

	const { children }: LayoutProps = $props();
</script>

<AuthLayout>{@render children()}</AuthLayout>
