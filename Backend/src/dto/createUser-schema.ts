import { object, string } from 'yup';

const userRegisterValidationSchema = object({
  body: object({
    firstName: string().required('First name is required'),
    lastName: string().required('Last name is required'),
    userName: string().required('Username is required'),
    // password complies to OWASP security
    userPassword: string()
      .min(8)
      .max(64)
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>\?])/,
        'Password must contain at least one Uppercase letter, one Lowercase letter, one Number, and one Special character'
      )
      .required('Password is required'),
      userEmail: string().email('Email must be a valid email').required('Email is required'),
  }),
});
const userLoginValidationSchema = object({
  body: object({
    userName: string().required('Username is required'),
    userPassword: string().required('Password is required'),
  }),
});

export { userRegisterValidationSchema, userLoginValidationSchema };
