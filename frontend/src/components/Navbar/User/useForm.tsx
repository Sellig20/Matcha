import { useState } from 'react';

export const useForm = (initialValues: { [key: string]: any }) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (event: React.ChangeEvent<
        HTMLInputElement 
        | HTMLSelectElement 
        | HTMLTextAreaElement> ) => {
        const { id, value } = event.target;
        setValues({ ...values, [id]: value });
    };

    const updateFormValues = (name: string, value: any) => {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return [values, handleChange, updateFormValues] as const;
};