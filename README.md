# react-native-check-rooting

Check rooting

## Installation

package.json
```
"dependencies": {
  "react": "17.0.2",
  "react-native": "0.67.4"
  "reat-native-check-rooting: "git+https://github.com/teamslogup/reat-native-check-rooting.git",
}
```

## Usage

```js
import { isDeviceRooted } from "react-native-check-rooting";

// ...

export default function App() {
  const [result, setResult] = React.useState<boolean>();

  React.useEffect(() => {
    isDeviceRooted().then(setResult);
  }, [result]);

  return (
    <View style={styles.container}>
      <Text>is Device Rooted: {`${result}`}</Text>
    </View>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
