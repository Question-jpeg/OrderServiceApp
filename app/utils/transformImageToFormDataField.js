export default (imageUri) => ({
  name: imageUri.substring(imageUri.lastIndexOf("/") + 1, imageUri.length),
  type: "image/jpeg",
  uri: imageUri,
});
