# @ilz5753/react-native-time-line

A customizable and animated timeline component for React Native applications.

## Installation

```sh

npm install @ilz5753/react-native-time-line
# or yarn
yarn add @ilz5753/react-native-time-line
# or bun
bun add @ilz5753/react-native-time-line

```

## Usage

```tsx
import TimeLine, {
  ITimeLineItem,
  TTimeLineAnimatedComponentProps,
} from "@ilz5753/react-native-time-line";

function Node({
  animatedValue,
  sharedProps = {},
  goto,
  activeIndex,
  isActive,
}: TTimeLineAnimatedComponentProps) {
  return (
    <View>
      <Text>Hello from Node</Text>
    </View>
  );
}
function Label({
  animatedValue,
  sharedProps = {},
  goto,
  activeIndex,
  isActive,
}: TTimeLineAnimatedComponentProps) {
  return (
    <View>
      <Text>Hello from Label</Text>
    </View>
  );
}
function Line({
  animatedValue,
  sharedProps = {},
  goto,
  activeIndex,
  isActive,
}: TTimeLineAnimatedComponentProps) {
  return (
    <View>
      <Text>Hello from Line</Text>
    </View>
  );
}
function Render({
  animatedValue,
  sharedProps = {},
  goto,
  activeIndex,
  isActive,
}: TTimeLineAnimatedComponentProps) {
  return (
    <View>
      <Text>Hello from Render</Text>
    </View>
  );
}

const timeLines: ITimeLineItem[] = [
  {
    id: "1",
    Node,
    Label,
    Line,
    Render,
    // disabled: true,
  },
  // ...
];

function App() {
  return (
    <TimeLine
      items={timeLines}
      delayBetween={200}
      duration={500}
      initialIndex={0}
      isRTL={false}
      spaceOut={50}
      gapHor={20}
      gapVert={20}
    />
  );
}
```

### TimeLine Props

| Prop         | Type              | Default | Description                                                                                                                                              |
| ------------ | ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| items        | `ITimeLineItem[]` |         | An array of timeline items. Each item consists of an `id`, a `Node` component, a `Line` component, a `Label` component, and an optional `disabled` flag. |
| delayBetween | `number`          | `0`     | The delay between the end of the previous animation and the start of the next one.                                                                       |
| duration     | `number`          | `300`   | The duration of each animation.                                                                                                                          |
| initialIndex | `number`          | `0`     | The index of the initially active item.                                                                                                                  |
| isRTL        | `boolean`         | `false` | Determines the direction of the timeline. Set to `true` for right-to-left languages.                                                                     |
| spaceOut     | `number`          | `20`    | The padding space arround component.                                                                                                                     |
| gapHor       | `number`          | `10`    | The horizontal gap between the node-label and line-render components.                                                                                    |
| gapVert      | `number`          | `10`    | The vertical gap between the node-line and label-render components.                                                                                      |
| sharedProps  | `object`          |         | Any additional props that should be shared among the animated components.                                                                                |

### TimeLineItem Props

| Prop     | Type                         | Description                                                             |
| -------- | ---------------------------- | ----------------------------------------------------------------------- |
| id       | `string`                     | A unique identifier for the timeline item.                              |
| Node     | `TTimeLineAnimatedComponent` | A component representing the visual element (node) in the timeline.     |
| Label    | `TTimeLineAnimatedComponent` | A component representing the label for the timeline item.               |
| Line     | `TTimeLineAnimatedComponent` | A component representing the line connecting the nodes in the timeline. |
| Render   | `TTimeLineAnimatedComponent` | A component representing the time line item Render.                     |
| disabled | `boolean`                    | When `true`, the item is disabled and not interactive.                  |

### Animated Component Props

The animated components (`Node`, `Line`, `Label`, and `Render`) receive the following props:

| Prop                | Type          | Description                                                                                              |
| ------------------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| animatedValue       | `SharedValue` | The current animated value (0-1).                                                                        |
| activeIndex         | `number`      | The index of the currently active item.                                                                  |
| isActive            | `boolean`     | boolean flag indicates item is active or not.                                                            |
| sharedProps         | `object`      | Any additional props passed to the component through the `sharedProps` prop of the `TimeLine` component. |
| goto(index: number) | `function`    | Manually move the timeline to the specified index.                                                       |

## Methods

The `TimeLine` component provides the following methods via the `ref` prop:

| Method              | Description                                        |
| ------------------- | -------------------------------------------------- |
| goto(index: number) | Manually move the timeline to the specified index. |

## License

This package is licensed under the [MIT license](/LICENSE).

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
