import { ApiError, ApiResponse } from 'backend/types';
import { Readable, writable } from 'svelte/store';

interface ApiArrayCacheOptions<
	T,
	RemoveResponse extends ApiResponse,
	LazyLoad extends boolean = false
> {
	lazyLoad?: LazyLoad;
	load: () => Promise<ApiResponse<T[]>>;
	remove?: (item: T) => RemoveResponse;
	add?: (item: T) => ApiResponse<T>;
}

interface ApiArrayCacheReturn<
	T,
	RemoveResponse,
	Opts extends ApiArrayCacheOptions<T, ApiResponse, boolean>
> extends Readable<T[]> {
	remove: Opts['remove'] extends undefined ? undefined : (item: T) => RemoveResponse;
	addFront: Opts['add'] extends undefined ? undefined : (item: T) => ApiResponse<T>;
	addBack: Opts['add'] extends undefined ? undefined : (item: T) => ApiResponse<T>;
}

export const createArrayApiCache = async <
	ReturnDataType extends Lazy extends true ? T[] | null : T[],
	T,
	RemoveResponse extends ApiResponse,
	Lazy extends boolean = false
>(
	opts: ApiArrayCacheOptions<T, RemoveResponse, Lazy>
): Promise<ApiArrayCacheReturn<T, RemoveResponse, typeof opts>> => {
	const { load, lazyLoad } = opts;

	const data = writable<ReturnDataType>(null as ReturnDataType);

	const loadData = async () => {
		const { data: loadData } = await load();

		if (loadData) {
			data.set(loadData as ReturnDataType);
			return;
		}
	};

	const lazySubscribe: typeof data.subscribe = (...args) => {
		loadData();
		return data.subscribe(...args);
	};

	if (!lazyLoad) {
		loadData();
	}

	const remove = () => {};

	return { subscribe: lazyLoad ? lazySubscribe : data.subscribe };
};
