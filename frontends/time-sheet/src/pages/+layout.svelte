<script lang="ts">
	import 'chartjs-adapter-date-fns';
	import '$lib/styles/global.scss';
	import ActionPoller from 'frontend.shared/components/ActionPoller';
	import NavigationLoader from 'frontend.shared/components/NavigationLoader';
</script>

<ActionPoller />
<NavigationLoader />
<slot />
