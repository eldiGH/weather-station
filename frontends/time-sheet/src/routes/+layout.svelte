<script lang="ts">
	import { browser } from '$app/environment';
	import ActionPoller from 'frontend.shared/components/ActionPoller';
	import NavigationLoader from 'frontend.shared/components/NavigationLoader';
</script>

{#if browser}
	<NavigationLoader />
{/if}

<ActionPoller />
<slot />
