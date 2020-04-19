import * as React from 'react';

import { StyledTextfield, Input, Label, Indicator, Icon } from './style';
import { colors } from '~/renderer/constants';

export type TestFunction = (str: string) => boolean;

interface Props {
  color?: string;
  fontColor?: string;
  indicatorColor?: string;
  label?: string;
  placeholder?: string;
  icon?: any;
  onIconClick?: (target: Inputfield) => void;
  inputType?: 'text' | 'email' | 'password' | 'number';
  style?: any;
  test?: TestFunction;
  rows?: number;
  cols?: number;
  backgroundColor?: string;
  value?: any;
  inputRef?: any;
}

interface State {
  activated: boolean;
  focused: boolean;
  error: boolean;
}

export class Inputfield extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    color: colors.blue['500'],
    inputType: 'text',
  };

  public state: State = {
    activated: false,
    focused: false,
    error: false,
  };

  public get value() {
    return this.inputRef.current.value;
  }

  public set value(str: string) {
    this.inputRef.current.value = str;
  }

  onClick = () => {
    this.inputRef.current.focus();
  };

  public onFocus = () => {
    this.setState({
      activated: true,
      focused: true,
    });
  };

  public onBlur = () => {
    this.setState({
      activated: this.value.length !== 0,
      focused: false,
    });
  };

  public onIconClick = (e: React.SyntheticEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();

    const { onIconClick } = this.props;

    if (typeof onIconClick === 'function') {
      onIconClick(this);
    }
  };

  public test(fn?: TestFunction) {
    const { test } = this.props;
    if (fn == null && test == null) return true;

    const correct = fn != null ? fn(this.value) : test(this.value);

    this.setState({
      error: !correct,
      focused: !correct,
      activated: this.value.length !== 0 || !correct,
    });

    return correct;
  }

  public onInput = () => {
    this.setState({ error: false });
  };

  public clear() {
    this.value = '';

    this.setState({
      activated: false,
      error: false,
      focused: false,
    });
  }

  render() {
    const {
      color,
      indicatorColor,
      label,
      placeholder,
      icon,
      inputType,
      style,
      fontColor,
      backgroundColor,
      value,
      inputRef
    } = this.props;
    const { activated, focused, error } = this.state;

    const hasLabel = label != null && label !== '';
    const hasIcon = icon != null && icon !== '';

    const primaryColor = error ? colors.red['500'] : color;

    return (
      <StyledTextfield onClick={this.onClick} style={style} background={backgroundColor}>
        <Input
          ref={inputRef}
          type={inputType}
          color={primaryColor}
          fontColor={fontColor}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          hasLabel={hasLabel}
          hasIcon={hasIcon}
          placeholder={label == null || focused ? placeholder : null}
          defaultValue={value}
          onInput={this.onInput}
          spellCheck={false}
        />
        {hasLabel && (
          <Label activated={activated} focused={focused} color={primaryColor}>
            {label}
          </Label>
        )}
        {hasIcon && <Icon src={icon} onClick={this.onIconClick} />}
        <Indicator focused={focused} color={indicatorColor} />
      </StyledTextfield>
    );
  }
}
