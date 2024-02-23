import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

export interface ITimeLineId {
  id: string;
}
export interface ITimeLineActiveIndex {
  activeIndex: number;
}
export interface ITimeLineIsActive {
  isActive: boolean;
}
export interface ITimeLineRef {
  goto(index: number): void;
}
export interface ITimeLineAnimatedValue {
  animatedValue: SharedValue<number>;
}
export interface ITimeLineSharedProps {
  sharedProps?: object;
}
export type TTimeLineAnimatedComponentProps = ITimeLineAnimatedValue &
  ITimeLineSharedProps &
  ITimeLineRef &
  ITimeLineActiveIndex &
  ITimeLineIsActive;
export type TTimeLineAnimatedComponent =
  ComponentType<TTimeLineAnimatedComponentProps>;
export interface ITimeLineItem extends ITimeLineId {
  Node: TTimeLineAnimatedComponent;
  Line: TTimeLineAnimatedComponent;
  Label: TTimeLineAnimatedComponent;
  Render: TTimeLineAnimatedComponent;
  disabled?: boolean;
}
export interface ITimeLine extends ITimeLineSharedProps {
  isRTL?: boolean;
  items: ITimeLineItem[];
  delayBetween?: number;
  duration?: number;
  initialIndex?: number;
  spaceOut?: number;
  gapHor?: number;
  gapVert?: number;
}

let layoutAnimation = {
  layout: LinearTransition,
};
const TimeLine = forwardRef<ITimeLineRef, ITimeLine>(
  (
    {
      items,
      isRTL = false,
      delayBetween = 120,
      duration = 300,
      sharedProps,
      initialIndex = 0,
      spaceOut = 0,
      gapHor = 10,
      gapVert = 10,
    },
    ref
  ) => {
    let length = useMemo(() => items.length, [items]);
    let sharedValues = Array(length)
      .fill("")
      .map((_, i) => {
        let iv = i <= initialIndex ? 1 : 0;
        return {
          node: useSharedValue(iv),
          label: useSharedValue(iv),
          line: useSharedValue(iv),
          render: useSharedValue(iv),
        };
      });
    let [activeIndex, setActiveIndex] = useState(initialIndex);
    let md = useCallback((m: number) => m * duration, [duration]);
    let timing = useMemo(() => ({ duration: md(1) }), [md]);
    let goto = useCallback(
      (index: number) => {
        let finalIndex = index;
        if (index <= 0) finalIndex = 0;
        else if (index >= length) finalIndex = length - 1;
        let diff = finalIndex - activeIndex;
        let posDiff = Math.abs(diff);
        let delDif = delayBetween * posDiff;
        let baseDelay = 0;
        if (diff === 0) return;
        else if (diff > 0) {
          let f = sharedValues[activeIndex]!;
          f.render.value = withTiming(0, timing);
          for (let i = 1; i <= diff; i++) {
            let ind = activeIndex + i;
            let { line, node, label } = sharedValues[ind]!;
            node.value = withDelay(baseDelay, withTiming(1, timing));
            label.value = withDelay(baseDelay + md(1), withTiming(1, timing));
            line.value = withDelay(baseDelay + md(2), withTiming(1, timing));
            baseDelay += delayBetween + md(3);
          }
          let e = sharedValues[finalIndex]!;
          e.render.value = withDelay(delDif + md(3), withTiming(1, timing));
        } else {
          let e = sharedValues[activeIndex]!;
          e.render.value = withTiming(0, timing);
          for (let i = 0; i < posDiff; i++) {
            let ind = activeIndex - i;
            let { line, node, label } = sharedValues[ind]!;
            line.value = withDelay(baseDelay, withTiming(0, timing));
            label.value = withDelay(baseDelay + md(1), withTiming(0, timing));
            node.value = withDelay(baseDelay + md(2), withTiming(0, timing));
            baseDelay += delayBetween + md(3);
          }
          let f = sharedValues[finalIndex]!;
          f.render.value = withDelay(
            delayBetween * posDiff + md(3),
            withTiming(1, timing)
          );
        }
        setTimeout(
          () => {
            setActiveIndex(finalIndex);
          },
          delDif + md(4)
        );
      },
      [activeIndex, delayBetween, md, timing, length]
    );
    useImperativeHandle(ref, () => ({
      goto,
    }));
    let row = useMemo(
      () => [
        styles[`fd${isRTL ? "rr" : "r"}`],
        styles.aic,
        styles.fw,
        { gap: gapHor },
      ],
      [isRTL, gapHor]
    );
    let sameProps = useMemo(
      () => ({ activeIndex, goto, sharedProps }),
      [goto, sharedProps, activeIndex]
    );
    return (
      <Animated.View
        {...{
          style: [styles.fw, { padding: spaceOut, gap: gapVert }],
          ...layoutAnimation,
        }}
      >
        {items.map(
          ({ id, Node, Line, Render, Label, disabled = false }, index) => {
            let { node, label, line, render } = sharedValues[index]!;
            let isActive = index <= activeIndex;
            return (
              <Animated.View
                {...{
                  key: id,
                  style: [
                    styles.fw,
                    {
                      gap: gapVert,
                    },
                    disabled && styles.op6,
                    styles.oh,
                  ],
                  ...layoutAnimation,
                }}
              >
                <Animated.View {...{ style: [row], ...layoutAnimation }}>
                  <Node {...{ animatedValue: node, isActive, ...sameProps }} />
                  <Animated.View
                    {...{ style: [styles.f1], ...layoutAnimation }}
                  >
                    <Label
                      {...{ animatedValue: label, isActive, ...sameProps }}
                    />
                  </Animated.View>
                </Animated.View>
                <Animated.View {...{ style: [row], ...layoutAnimation }}>
                  <Line {...{ animatedValue: line, isActive, ...sameProps }} />
                  <Animated.View
                    {...{ style: [styles.f1], ...layoutAnimation }}
                  >
                    <Render
                      {...{ animatedValue: render, isActive, ...sameProps }}
                    />
                  </Animated.View>
                </Animated.View>
                {disabled && (
                  <Animated.View
                    {...{
                      style: [styles.full, styles.overlay, styles.shadowBg],
                      entering: FadeIn,
                      exiting: FadeOut,
                    }}
                  />
                )}
              </Animated.View>
            );
          }
        )}
      </Animated.View>
    );
  }
);
const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
  fw: {
    width: "100%",
  },
  fdr: {
    flexDirection: "row",
  },
  fdrr: {
    flexDirection: "row-reverse",
  },
  aic: {
    alignItems: "center",
  },
  oh: {
    overflow: "hidden",
  },
  op6: {
    opacity: 0.6,
  },
  full: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    zIndex: 1,
  },
  shadowBg: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
});
export default TimeLine;
