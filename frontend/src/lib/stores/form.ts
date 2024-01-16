import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import { type z, type Schema } from 'zod';

type ChangePropsType<T extends Record<string, unknown>, NewType> = {
	[key in keyof T]: NewType;
};

export type FormReturn<
	Values extends Record<string, unknown>,
	MySchema extends Schema | undefined
> = {
	values: Writable<Values>;
	errors: Writable<ChangePropsType<Values, string>>;
	touched: Readable<ChangePropsType<Values, boolean>>;
	validate: MySchema extends Schema ? () => Promise<Values> : undefined;
	isSubmitting: Readable<boolean>;
	isValid: Readable<boolean>;
	submit: (onSubmit: (data: Values) => Promise<void>) => (e: SubmitEvent) => Promise<void>;
	handleBlur: (event: FocusEvent) => void;
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
	MySchema extends Schema | undefined = undefined
>(
	initialValues: T,
	schema?: MySchema
): FormReturn<T, MySchema> => {
	const values = writable(initialValues);
	const touched = writable(getInitialTouched(initialValues));
	const errors = writable(getInitialErrors(initialValues, schema));
	const isSubmitting = writable(false);

	const isValid = derived(errors, ($errors) => Object.values($errors).every((error) => !error));

	const hasAnyErrors = () => Object.values(get(errors)).some((error) => !!error);

	const clearErrors = () => {
		const newErrors = get(errors);

		for (const key in newErrors) {
			newErrors[key] = '';
		}

		errors.set(newErrors);
	};

	const validate = (
		schema
			? async () => {
					const response = parseZodResponse(await schema.spa(get(values)));

					if (response.success) {
						clearErrors();
						return response.data;
					}

					errors.set(response.errors as ChangePropsType<T, string>);
				}
			: undefined
	) as MySchema extends Schema ? () => Promise<T> : undefined;

	const submit = (onSubmit: (data: T) => Promise<void>) => async (e: SubmitEvent) => {
		e.preventDefault();

		let parsedValues: T = get(values);

		if (validate) {
			parsedValues = await validate();
		}

		if (hasAnyErrors()) {
			return;
		}

		isSubmitting.set(true);
		await onSubmit(parsedValues);
		isSubmitting.set(false);
	};

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

	if (validate) {
		values.subscribe(() => {
			validate();
		});
	}

	return {
		values,
		errors,
		submit,
		validate,
		isSubmitting: { subscribe: isSubmitting.subscribe },
		isValid: { subscribe: isValid.subscribe },
		touched: { subscribe: touched.subscribe },
		handleBlur
	};
};
