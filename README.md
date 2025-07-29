# Col-Cal

Is a lightweight, HTML-friendly web component calendar designed to be easy to author and integrate into any web framework. It is built using Lit, a lightweight library for building web components, ensuring that the components are highly performant and maintainable

## Features

- HTML-friendly - easy to author, framework-independent
- Composable - impose no DOM specific structure, play well with others

## Installation

To use this project, you need to install the necessary dependencies. You can do this using npm or yarn.

### Compile from source

```sh
git clone https://github.com/kogeletey/col-cal
cd col-cal
npm ci
npx vite build
```

## Usage

```html
  <col-cal locale="en"></col-cal>
  <script type="module">
    import "col-cal";
  </script>
```

## Dependencies

- **Lit**: A lightweight library for building web components.

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

## Contributing

 Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
