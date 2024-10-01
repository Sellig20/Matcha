import { useState } from 'react';

export const useForm = (initialValues: { [key: string]: string }) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement 
        | HTMLSelectElement 
        | HTMLTextAreaElement> ) => {
        const { id, value } = event.target;
        setValues({ ...values, [id]: value });
    };

    return [values, handleChange] as const;
};