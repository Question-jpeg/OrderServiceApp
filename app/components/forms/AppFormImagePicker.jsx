import { useFormikContext } from "formik";
import ImageInputList from "../inputs/ImageInputList";
import { ErrorMessage } from "formik";

export default function AppFormImagePicker({ imageWidth, imageHeight, blockErrors, name }) {
  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <ImageInputList
        imagesUris={values[name]}
        updateUris={(uris) => setFieldValue(name, uris)}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
      {/* <ErrorMessage error={!blockErrors && errors[name]} /> */}
    </>
  );
}
