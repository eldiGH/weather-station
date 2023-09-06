import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import { ValidationError, type InferType, type Schema } from 'yup';

type ChangePropsType<T extends Record<string, unknown>, NewType> = {
	[key in keyof T]: NewType;
};

export type FormReturn<Values extends Record<string, unknown>, MySchema> = {
	values: Writable<Values>;
	errors: Writable<ChangePropsType<Values, string>>;
	touched: Readable<ChangePropsType<Values, boolean>>;
	validate: MySchema extends Schema ? () => Promise<Values> : undefined;
	isSubmitting: Readable<boolean>;
	isValid: Readable<boolean>;
	submit: (onSubmit: (data: Values) => Promise<void>) => (e: SubmitEvent) => Promise<void>;
	handleBlur: (event: FocusEvent) => void;
};

const getInitialErrors = <T extends Record<string, unknown>>(
	initialValues: T
): ChangePropsType<T, string> => {
	const errors: Record<string, unknown> = {};

	for (const key of Object.keys(initialValues)) {
		errors[key] = '';
	}

	return errors as ChangePropsType<T, string>;
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
	T extends MySchema extends Schema ? InferType<MySchema> : Record<string, unknown>,
	MySchema extends Schema | undefined = undefined
>(
	initialValues: T,
	schema?: MySchema
): FormReturn<T, MySchema> => {
	const values = writable(initialValues);
	const errors = writable(getInitialErrors(initialValues));
	const touched = writable(getInitialTouched(initialValues));
	const isSubmitting = writable(false);

	const hasAnyErrors = () => Object.values(get(errors)).some((error) => !!error);

	const isValid = derived(errors, ($errors) => Object.values($errors).every((error) => !error));

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
					try {
						const parsedData = await schema.validate(get(values), { abortEarly: false });
						clearErrors();
						return parsedData;
					} catch (e) {
						if (!(e instanceof ValidationError)) {
							throw e;
						}

						const finalErrors: Record<string, unknown> = {};

						for (const error of e.inner) {
							if (error.path) {
								finalErrors[error.path] = error.errors[0];
							}
						}

						errors.set(finalErrors as ChangePropsType<T, string>);
					}
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

	values.subscribe(() => {
		if (validate) {
			validate();
		}
	});

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
