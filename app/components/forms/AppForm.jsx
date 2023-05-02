import { forwardRef, useImperativeHandle, useRef } from "react";
import { Formik } from "formik";

export const AppForm = forwardRef(({ children, initialValues, onSubmit, validationSchema, ...other }, ref) => {

  const form = useRef()

  useImperativeHandle(ref, () => ({
    resetForm: form.current?.resetForm,
    getValues: () => form.current?.values,
    getErrors: () => form.current?.errors,
    setFieldValue: form.current?.setFieldValue,
  }))

  return (
    <Formik
      innerRef={form}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
      {...other}
    >
      {() => <>{children}</>}
    </Formik>
  );
});
