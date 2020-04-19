import { observer } from 'mobx-react';
import { StyledSwitch } from './style';
import React from 'react';

@observer
export class Switch extends React.Component<{ checked: boolean; click: any }> {
	public state = {
		toggled: this.props.checked,
	}

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if(this.props.checked == true) {
			this.setState({ ...this.state, toggled: true })
		} else {
			this.setState({ ...this.state, toggled: false })
		}
	}

	handleClick() {
		this.setState({ ...this.state, toggled: !this.state.toggled })
		this.props.click(!this.state.toggled);
	}

	render() {
		return (
			<StyledSwitch toggled={this.state.toggled} onClick={() => this.handleClick()}>
				<input type="checkbox" style={{ display: 'none' }} checked={this.state.toggled} readOnly />
			</StyledSwitch>
		)
	}
}