import { observer } from 'mobx-react';
import { StyledSelect, Arrow, List, ListItem } from './style';
import React from 'react';
import ClickOutside from "react-click-outside";

@observer
export class Select extends React.Component<{ value: any; items: any[]; valueRef: React.RefObject<HTMLDivElement> }> {
    public state = {
        toggled: false,
        value: `${this.props.value}`
    }

    constructor(props) {
        super(props);
    }

    handleClick() {
        this.setState({ ...this.state, toggled: !this.state.toggled })
    }

    onClickOutside() {
        this.setState({ ...this.state, toggled: false })
    }

    setValue(value, click) {
        click()
        this.forceUpdate()
        this.props.valueRef.current.innerText = value;
        this.forceUpdate()
    }

    render() {
        return (
            <ClickOutside onClickOutside={() => this.onClickOutside()}>
                <StyledSelect onClick={() => this.handleClick()} toggled={this.state.toggled}>
                    <span ref={this.props.valueRef}>{this.state.value}</span>
                    <Arrow toggled={this.state.toggled} />
                    <List visible={this.state.toggled}>
                        {this.props.items.map(item => (
                            <ListItem onClick={() => this.setValue(item.name, item.onClick)} key={Math.random()*100}>{item.name}</ListItem>
                        ))}
                    </List>
                </StyledSelect>
            </ClickOutside>
        )
    }
}