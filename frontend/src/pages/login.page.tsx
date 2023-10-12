import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useNotify from '../hooks/notify';
import { useAppDispatch } from '../store';
import { useFormik } from 'formik';
import { login } from '../store/actions/auth.action';

const LoginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required').min(8).max(36),
});

export default function LoginPage() {
  const { notify } = useNotify();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async ({ ...values }, { setErrors, resetForm, setSubmitting }) => {
      try {
        const { message } = await dispatch(login(values));
        notify(message, 'success');
        resetForm();
        navigate('/');
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
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Start you session. Or{' '}
            <Link className=" text-blue-700" to="/signup">
              Create a account?
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit}>
            <div className="grid w-full items-center gap-4">
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
              <div className="flex flex-col justify-center items-center space-y-3">
                <Button type="submit" disabled={form.isSubmitting || !form.isValid}>
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
