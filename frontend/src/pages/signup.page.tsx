import * as Yup from 'yup';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import useNotify from '../hooks/notify';
import { register } from '../store/actions/auth.action';
import { useAppDispatch } from '../store';

const RegisterSchema = Yup.object({
  firstName: Yup.string().required('Name is required'),
  lastName: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required').min(8).max(36),
  ['confirm-password']: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
});

export default function SignUp() {
  const { notify } = useNotify();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      'confirm-password': '',
    },
    validationSchema: RegisterSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async ({ 'confirm-password': _confirmPassword, ...values }, { setErrors, resetForm, setSubmitting }) => {
      try {
        const { message } = await dispatch(register(values));
        notify(message, 'success');
        resetForm();
        navigate('/login');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.errors) {
          setErrors(err.errors);
        }
        notify(err.message, 'error');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full m-2 md:w-1/2 md:m-0 xl:w-1/4">
        <CardHeader className="text-center">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Register your account.{' '}
            <Link className="text-blue-700" to="/login">
              Already have an account?.
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>First Name</Label>
                <Input type="text" name="firstName" placeholder="First Name" value={form.values.firstName} onChange={form.handleChange} />
                <span className="text-red-500 text-xs">{form.errors.firstName}</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Last Name</Label>
                <Input type="text" name="lastName" placeholder="Last Name" value={form.values.lastName} onChange={form.handleChange} />
                <span className="text-red-500 text-xs">{form.errors.lastName}</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Email</Label>
                <Input id="email" name="email" placeholder="Email" value={form.values.email} onChange={form.handleChange} />
                <span className="text-red-500 text-xs">{form.errors.email}</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.values.password}
                  onChange={form.handleChange}
                />
                <span className="text-red-500 text-xs">{form.errors.password}</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm Password"
                  value={form.values['confirm-password']}
                  onChange={form.handleChange}
                />
                <span className="text-red-500 text-xs">{form.errors['confirm-password']}</span>
              </div>
              <div className="flex flex-col justify-center items-center space-y-3">
                <Button disabled={form.isSubmitting || !form.isValid} type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
