import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, MenuItem, Select } from '@mui/material';

const SignUpForm: React.FC = () => {
  const initialValues = {
    email: '',
    username: '',
    lastName: '',
    firstName: '',
    password: '',
    gender: '',
    sexualPreferences: [] as string[],
    biography: '',
    interests: [] as string[],
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    username: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    firstName: Yup.string().required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    gender: Yup.string().required('Required'),
    sexualPreferences: Yup.array().of(Yup.string()),
    biography: Yup.string(),
    interests: Yup.array().of(Yup.string()),
  });

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const response = await axios.post('http://localhost:8000/api/signup', values);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ values }) => (
        <Form>
          <Field name="email" as={TextField} label="Email" fullWidth margin="normal" />
          <ErrorMessage name="email" component="div" />

          <Field name="username" as={TextField} label="Username" fullWidth margin="normal" />
          <ErrorMessage name="username" component="div" />

          <Field name="lastName" as={TextField} label="Last Name" fullWidth margin="normal" />
          <ErrorMessage name="lastName" component="div" />

          <Field name="firstName" as={TextField} label="First Name" fullWidth margin="normal" />
          <ErrorMessage name="firstName" component="div" />

          <Field name="password" as={TextField} type="password" label="Password" fullWidth margin="normal" />
          <ErrorMessage name="password" component="div" />

          <Field name="gender" as={Select} fullWidth margin="normal">
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Field>
          <ErrorMessage name="gender" component="div" />

          <Field name="sexualPreferences" as={Select} multiple fullWidth margin="normal" value={values.sexualPreferences}>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Field>
          <ErrorMessage name="sexualPreferences" component="div" />

          <Field name="biography" as={TextField} label="Biography" multiline rows={4} fullWidth margin="normal" />
          <ErrorMessage name="biography" component="div" />

          <Field name="interests" as={TextField} label="Interests" fullWidth margin="normal" />
          <ErrorMessage name="interests" component="div" />

          <Button type="submit" variant="contained" color="primary">Sign Up</Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
