import { shallowEqual } from 'backend/helpers';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import { type z, type Schema } from 'zod';

type ChangePropsType<T extends Record<string, unknown>, NewType> = {
	[key in keyof T]: NewType;
};

export type FormSubmitEventObject = SubmitEvent & {
	currentTarget: EventTarget & HTMLFormElement;
};

export type FormSubmit<T extends Record<string, unknown>> = <
	R extends Promise<void> | void | Promise<boolean> | boolean = Promise<void>
>(
	onSubmit: (data: T) => R
) => (e: FormSubmitEventObject) => R;

type ValidateResponse<T extends Record<string, unknown>> =
	| { data: T; errors?: undefined }
	| { data?: undefined; errors: ChangePropsType<T, string> };

export type FormReturn<
	Values extends Record<string, unknown>,
	MySchema extends Schema | undefined,
	InferredValues extends Record<string, unknown> = MySchema extends Schema
		? z.infer<MySchema>
		: Values
> = {
	values: Writable<InferredValues>;
	errors: Writable<ChangePropsType<InferredValues, string>>;
	touched: Readable<ChangePropsType<InferredValues, boolean>>;
	touchedErrors: Readable<ChangePropsType<InferredValues, string>>;
	validate: MySchema extends Schema ? () => ValidateResponse<InferredValues> : undefined;
	isSubmitting: Readable<boolean>;
	isValid: Readable<boolean>;
	submit: FormSubmit<InferredValues>;
	handleBlur: (event: FocusEvent) => void;
	reset: () => void;
};

const parseZodResponse = (
	response: z.SafeParseReturnType<unknown, unknown>
):
	| { success: true; data: Record<string, unknown> }
	| { success: false; errors: Record<string, unknown> } => {
	if (response.success) {
		return { success: true, data: response.data as Record<string, unknown> };
	}

	const schemaErrors = response.error.errors;

	const finalErrors: Record<string, unknown> = {};

	for (const error of schemaErrors) {
		if (error.path) {
			finalErrors[error.path[0]] = error.message;
		}
	}

	return { success: false, errors: finalErrors };
};

const getInitialErrors = <T extends Record<string, unknown>>(
	initialValues: T,
	schema: Schema | undefined
): ChangePropsType<T, string> => {
	const blankErrors: Record<string, unknown> = {};

	for (const key of Object.keys(initialValues)) {
		blankErrors[key] = '';
	}

	if (!schema) {
		return blankErrors as ChangePropsType<T, string>;
	}

	const response = parseZodResponse(schema.safeParse(initialValues));

	if (response.success) {
		return blankErrors as ChangePropsType<T, string>;
	}

	return response.errors as ChangePropsType<T, string>;
};

const getInitialTouched = <T extends Record<string, unknown>>(
	initialValues: T
): ChangePropsType<T, boolean> => {
	const touched: Record<string, unknown> = {};

	for (const key of Object.keys(initialValues)) {
		touched[key] = false;
	}

	return touched as ChangePropsType<T, boolean>;
};

export const createForm = <
	T extends MySchema extends Schema ? z.infer<MySchema> : Record<string, unknown>,
	MySchema extends Schema | undefined = undefined,
	InferredValues extends Record<string, unknown> = MySchema extends Schema ? z.infer<MySchema> : T,
	R extends FormReturn<T, MySchema, InferredValues> = FormReturn<T, MySchema, InferredValues>
>(
	initialValues: T,
	schema?: MySchema
): FormReturn<T, MySchema, InferredValues> => {
	const values = writable({ ...initialValues });
	const touched = writable(getInitialTouched(initialValues));
	const errors = writable(getInitialErrors(initialValues, schema));
	const isSubmitting = writable(false);

	const touchedErrors = derived([errors, touched], ([$errors, $touched]) => {
		const touchedErrors = { ...$errors };

		for (const key in $errors) {
			if (!$touched[key]) {
				touchedErrors[key] = '';
			}
		}

		return touchedErrors;
	});

	const isValid = derived(
		[errors, values],
		([$errors, $values]) =>
			Object.values($errors).every((error) => !error) && !shallowEqual($values, initialValues)
	);

	const clearErrors = () => {
		const newErrors = { ...get(errors) };

		let modified = false;
		for (const key in newErrors) {
			if (newErrors[key].length > 0) {
				modified = true;
			}
			newErrors[key] = '';
		}

		if (modified) {
			errors.set(newErrors);
		}
	};

	const validate = (
		schema
			? () => {
					const response = parseZodResponse(schema.safeParse(get(values)));

					if (response.success) {
						clearErrors();
						return { data: response.data };
					}

					const currentErrors = get(errors);
					if (shallowEqual(currentErrors, response.errors)) {
						return { errors: response.errors };
					}

					errors.set(response.errors as ChangePropsType<T, string>);
					return { errors: response.errors };
				}
			: undefined
	) as R['validate'];

	const submit = ((onSubmit) => async (e) => {
		e.preventDefault();

		let parsedData: InferredValues = get(values);

		if (validate) {
			const { data, errors } = validate();

			if (errors || !data) {
				return false;
			}

			parsedData = data;
		}

		isSubmitting.set(true);
		const result = await onSubmit(parsedData);
		isSubmitting.set(false);

		if (typeof result === 'boolean') {
			return result;
		}

		return true;
	}) as FormSubmit<InferredValues>;

	const handleBlur = (e: FocusEvent) => {
		const target = e.target as HTMLInputElement;

		const name = target.attributes?.getNamedItem('name');

		if (!name) {
			return;
		}

		touched.update((touched) => {
			if (!(name.value in touched) && touched[name.value] === false) {
				return touched;
			}

			return { ...touched, [name.value]: true };
		});
	};

	const reset = () => {
		values.set({ ...initialValues });
		touched.set(getInitialTouched(initialValues));
		isSubmitting.set(false);
		clearErrors();
	};

	if (validate) {
		values.subscribe(() => {
			validate();
		});
	}

	return {
		values,
		errors,
		touchedErrors,
		submit,
		validate,
		isSubmitting: { subscribe: isSubmitting.subscribe },
		isValid: { subscribe: isValid.subscribe },
		touched: { subscribe: touched.subscribe },
		handleBlur,
		reset
	};
};
