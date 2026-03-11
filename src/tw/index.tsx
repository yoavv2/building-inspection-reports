import React from 'react';
import { useCssElement, useNativeVariable as useFunctionalVariable } from 'react-native-css';
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from 'react-native';

type WithClassName<T> = T & { className?: string };

export const useCSSVariable =
  process.env.EXPO_OS !== 'web'
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

export const View = (props: WithClassName<React.ComponentProps<typeof RNView>>) => {
  return useCssElement(RNView, props, { className: 'style' });
};
View.displayName = 'CSS(View)';

export const Text = (props: WithClassName<React.ComponentProps<typeof RNText>>) => {
  return useCssElement(RNText, props, { className: 'style' });
};
Text.displayName = 'CSS(Text)';

export const ScrollView = (
  props: WithClassName<React.ComponentProps<typeof RNScrollView>> & {
    contentContainerClassName?: string;
  },
) => {
  return useCssElement(RNScrollView, props, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  });
};
ScrollView.displayName = 'CSS(ScrollView)';

export const Pressable = (props: WithClassName<React.ComponentProps<typeof RNPressable>>) => {
  return useCssElement(RNPressable, props, { className: 'style' });
};
Pressable.displayName = 'CSS(Pressable)';

export const TouchableOpacity = (
  props: WithClassName<React.ComponentProps<typeof RNTouchableOpacity>>,
) => {
  return useCssElement(RNTouchableOpacity, props, { className: 'style' });
};
TouchableOpacity.displayName = 'CSS(TouchableOpacity)';

export const TextInput = (props: WithClassName<React.ComponentProps<typeof RNTextInput>>) => {
  return useCssElement(RNTextInput, props, { className: 'style' });
};
TextInput.displayName = 'CSS(TextInput)';
