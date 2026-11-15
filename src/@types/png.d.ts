/**
 * Lets TypeScript accept `import logo from './logo.png'`.
 * Metro (the bundler) turns the import into an image reference that can be
 * passed straight to an `<Image source={...} />`.
 */
declare module '*.png' {
    const value: any;
    export default value;
}
