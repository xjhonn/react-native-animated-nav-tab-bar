var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// UI Components imports
import { CommonActions, } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Animated, Dimensions, I18nManager, StyleSheet, View, } from "react-native";
import { ScreenContainer } from "react-native-screens";
import ResourceSavingScene from "./ResourceSavingScene";
import { TabElementDisplayOptions } from "./types";
import { BottomTabBarWrapper, Dot, Label, TabButton } from "./UIComponents";
/**
 * @name TabBarElement
 * React Navigation v5 custom navigation (bottom tab bar) builder with an
 * an interactive animation, and easily customizable.
 *
 * @param state Navigation state
 * @param navigation Navigation object
 * @param descriptors
 * @param appearance Object with appearance configurations (see readme)
 * @param rest
 *
 * @return function that creates the custom tab bar
 */
export default (function (_a) {
    var state = _a.state, navigation = _a.navigation, descriptors = _a.descriptors, appearance = _a.appearance, tabBarOptions = _a.tabBarOptions, lazy = _a.lazy;
    // Appearance options destruction
    var topPadding = appearance.topPadding, bottomPadding = appearance.bottomPadding, horizontalPadding = appearance.horizontalPadding, tabBarBackground = appearance.tabBarBackground, activeTabBackgrounds = appearance.activeTabBackgrounds, activeColors = appearance.activeColors, floating = appearance.floating, dotCornerRadius = appearance.dotCornerRadius, whenActiveShow = appearance.whenActiveShow, whenInactiveShow = appearance.whenInactiveShow, dotSize = appearance.dotSize, shadow = appearance.shadow, tabButtonLayout = appearance.tabButtonLayout;
    var activeTintColor = tabBarOptions.activeTintColor, inactiveTintColor = tabBarOptions.inactiveTintColor, activeBackgroundColor = tabBarOptions.activeBackgroundColor, tabStyle = tabBarOptions.tabStyle, labelStyle = tabBarOptions.labelStyle;
    // State
    var _b = useState(horizontalPadding), prevPos = _b[0], setPrevPos = _b[1];
    var _c = useState(prevPos), pos = _c[0], setPos = _c[1];
    var _d = useState(0), width = _d[0], setWidth = _d[1];
    var _e = useState(0), height = _e[0], setHeight = _e[1];
    var animatedPos = useState(function () { return new Animated.Value(1); })[0];
    var _f = useState([state.index]), loaded = _f[0], setLoaded = _f[1];
    useEffect(function () {
        var index = state.index;
        setLoaded(loaded.includes(index) ? loaded : __spreadArray(__spreadArray([], loaded, true), [index], false));
    }, [state]);
    // false = Portrait
    // true = Landscape
    var _g = useState(true), isPortrait = _g[0], setIsPortrait = _g[1];
    // Reset animation when changing screen orientation
    Dimensions.addEventListener("change", function () {
        if ((isPortrait && !didChangeToPortrait()) ||
            (!isPortrait && didChangeToPortrait())) {
            setIsPortrait(!isPortrait);
            animation(animatedPos).start(function () {
                updatePrevPos();
            });
        }
    });
    /**
     * @returns true if current orientation is Portrait, false otherwise
     */
    var didChangeToPortrait = function () {
        var dim = Dimensions.get("screen");
        return dim.height >= dim.width;
    };
    /**
     * Dot animation
     * @param {*} val animation value
     * @returns Animated.CompositeAnimation
     * Use .start() to start the animation
     */
    var animation = function (val) {
        return Animated.spring(val, {
            toValue: 1,
            useNativeDriver: false,
        });
    };
    /**
     * Helper function that updates the previous position
     * of the tab to calculate the new position.
     */
    var updatePrevPos = function () {
        setPos(function (pos) {
            setPrevPos(pos);
            return pos;
        });
        animatedPos.setValue(0);
    };
    useEffect(function () {
        animation(animatedPos).start(function () {
            updatePrevPos();
        });
    }, []);
    /**
     * Animate whenever the navigation state changes
     */
    useEffect(function () {
        if (state.index !== prevPos) {
            setPrevPos(state.index);
            animation(animatedPos).start();
        }
    }, [state.index]);
    // Compute activeBackgroundColor, if array provided, use array otherwise fallback to
    // default tabBarOptions property activeBackgroundColor (fallbacks for all unspecified tabs)
    var activeTabBackground = activeTabBackgrounds
        ? Array.isArray(activeTabBackgrounds)
            ? activeTabBackgrounds[state.index] || activeBackgroundColor
            : activeTabBackgrounds
        : activeBackgroundColor;
    // Compute activeBackgroundColor, if array provided, use array otherwise fallback to
    // default tabBarOptions property activeTintColor (fallbacks for all unspecified tabs)
    var activeColor = activeColors
        ? Array.isArray(activeColors)
            ? activeColors[state.index] || activeTintColor
            : activeColors
        : activeTintColor;
    /**
     * Create a tab button given a route and route index
     * @param {*} route
     * @param {*} routeIndex
     * @returns React.Node with the button component
     */
    var createTab = function (route, routeIndex) {
        var focused = routeIndex == state.index;
        var options = descriptors[route.key].options;
        var tintColor = focused ? activeColor : inactiveTintColor;
        var icon = options.tabBarIcon;
        var label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
                ? options.title
                : route.name;
        var accessibilityLabel = options.tabBarAccessibilityLabel !== undefined
            ? options.tabBarAccessibilityLabel
            : typeof label === "string"
                ? "".concat(label, ", tab, ").concat(routeIndex + 1, " of ").concat(state.routes.length)
                : undefined;
        // Render the label next to the icon
        // only if showLabel is true
        var renderLabel = function () {
            if (typeof label === "string") {
                return (React.createElement(Label, { tabButtonLayout: tabButtonLayout, whenActiveShow: whenActiveShow, whenInactiveShow: whenInactiveShow, style: labelStyle, activeColor: tintColor }, label));
            }
            else {
                return label({ focused: focused, color: activeColor });
            }
        };
        /**
         * Helper function to render the icon
         */
        var renderIcon = function () {
            if (icon === undefined) {
                return null;
            }
            var defaultIconSize = 20;
            return icon({ focused: focused, color: tintColor, size: defaultIconSize });
        };
        /**
         * On Press Handler
         * Emits an event to the navigation
         */
        var onPress = function () {
            var event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
                navigation.dispatch(__assign(__assign({}, CommonActions.navigate(route.name)), { target: state.key }));
            }
        };
        /**
         * On Long Press Handler
         * Emits an event to the navigation
         */
        var onLongPress = function () {
            navigation.emit({
                type: "tabLongPress",
                target: route.key,
            });
        };
        /**
         * Read the position and dimension of a tab.
         * and update animation state
         * @param {*} e
         */
        var onLayout = function (e) {
            if (focused) {
                setPos(e.nativeEvent.layout.x);
                setWidth(e.nativeEvent.layout.width);
                setHeight(e.nativeEvent.layout.height);
            }
        };
        var labelAndIcon = function () {
            if (focused) {
                switch (whenActiveShow) {
                    case TabElementDisplayOptions.BOTH:
                        return (React.createElement(React.Fragment, null,
                            React.createElement(View, null, renderIcon()),
                            renderLabel()));
                    case TabElementDisplayOptions.LABEL_ONLY:
                        return renderLabel();
                    case TabElementDisplayOptions.ICON_ONLY:
                        return renderIcon();
                    default:
                        return (React.createElement(React.Fragment, null,
                            React.createElement(View, null, renderIcon()),
                            renderLabel()));
                }
            }
            else {
                switch (whenInactiveShow) {
                    case TabElementDisplayOptions.BOTH:
                        return (React.createElement(React.Fragment, null,
                            React.createElement(View, null, renderIcon()),
                            renderLabel()));
                    case TabElementDisplayOptions.LABEL_ONLY:
                        return renderLabel();
                    case TabElementDisplayOptions.ICON_ONLY:
                        return renderIcon();
                    default:
                        return (React.createElement(React.Fragment, null,
                            React.createElement(View, null, renderIcon()),
                            renderLabel()));
                }
            }
        };
        return (React.createElement(TabButton, { key: route.key, focused: focused, labelLength: label.length, accessibilityLabel: accessibilityLabel, onLayout: onLayout, onPress: onPress, onLongPress: onLongPress, dotSize: dotSize, tabButtonLayout: tabButtonLayout }, labelAndIcon()));
    };
    var overlayStyle = StyleSheet.create({
        overlayStyle: {
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "absolute",
        },
    }).overlayStyle;
    var options = descriptors[state.routes[state.index].key].options;
    var tabBarVisible = options.tabBarVisible == undefined ? true : options.tabBarVisible;
    return (React.createElement(React.Fragment, null,
        React.createElement(View, { style: {
                flex: 1,
                overflow: "hidden",
            } },
            React.createElement(ScreenContainer, { style: { flex: 1 } }, state.routes.map(function (route, index) {
                var descriptor = descriptors[route.key];
                var unmountOnBlur = descriptor.options.unmountOnBlur;
                var isFocused = state.index === index;
                if (unmountOnBlur && !isFocused) {
                    return null;
                }
                if (lazy && !loaded.includes(index) && !isFocused) {
                    // Don't render a screen if we've never navigated to it
                    return null;
                }
                return (React.createElement(ResourceSavingScene, { key: route.key, isVisible: isFocused, style: StyleSheet.absoluteFill },
                    React.createElement(View, { accessibilityElementsHidden: !isFocused, importantForAccessibility: isFocused ? "auto" : "no-hide-descendants", style: { flex: 1 } }, descriptor.render())));
            }))),
        tabBarVisible && (React.createElement(View, { pointerEvents: "box-none", style: floating && overlayStyle },
            React.createElement(BottomTabBarWrapper, { style: tabStyle, floating: floating, topPadding: topPadding, bottomPadding: bottomPadding, horizontalPadding: horizontalPadding, tabBarBackground: tabBarBackground, shadow: shadow },
                state.routes.map(createTab),
                React.createElement(Dot, { dotCornerRadius: dotCornerRadius, topPadding: topPadding, activeTabBackground: activeTabBackground, style: I18nManager.isRTL
                        ? {
                            right: animatedPos.interpolate({
                                inputRange: [0, 1],
                                outputRange: [prevPos, pos],
                            }),
                        }
                        : {
                            left: animatedPos.interpolate({
                                inputRange: [0, 1],
                                outputRange: [prevPos, pos],
                            }),
                        }, width: width, height: height }))))));
});
