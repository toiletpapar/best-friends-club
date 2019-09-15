// Declare non-(json|typescript|javascript) files to be used in the client here

declare module "*.png" {
  const content: string
  export default content
}