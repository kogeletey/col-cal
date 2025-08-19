# Col-Cal

Is a lightweight, HTML-friendly web component calendar

## Installation

To use this project, you need to install the necessary dependencies. You can do this using npm or yarn.

### Compile from source

```sh
git clone https://github.com/pksep/col-cal
cd col-cal
npm ci
npx vite build
```

## Usage

```html
  <col-cal locale="en-US"></col-cal>
  <script type="module">
    import "col-cal";
  </script>
```

## Dependencies

- **Lit**: A lightweight library for building web components.
- **Date-Fns**: A modern JavaScript date utility library that provides a comprehensive set of functions for manipulating and formatting dates.

## Development

To develop this project, you can use the following commands:

### Start Development Server

Install bun

```sh
bun vite
```

### Build for Production

```sh
bun vite build
```
<!--
## Contributing
Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information
-->

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
