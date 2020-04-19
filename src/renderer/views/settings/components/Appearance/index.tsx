import { observer } from 'mobx-react';
import { Container } from '../Categories/style';
import React from 'react';
import store from '../../store';
import { Item } from '../Item';
import { icons } from '~/renderer/views/app/constants';
import { Select } from '../Select';
import { getPrettyTheme } from '../Home';
import { Switch } from '../Switch';

const selector = Math.random().toString(36).substr(2, 5);

const themeRef = React.createRef<HTMLDivElement>();

const onHomeButtonClick = (toggled) => {
	if(toggled) {
		(window as any).settings.appearance.showHomeButton = true
	} else {
		(window as any).settings.appearance.showHomeButton = false
	}

	store.saveSettings((window as any).settings)
}

export const Appearance = observer(() => (
	<Container visible={store.currentContent == "appearance"} data-selector={selector}>
		<Item icon={icons.style} text={"Interface theme"} secondText={"Change the browser interface theme"} multiline noHover>
			<Select value={getPrettyTheme()} valueRef={themeRef} items={[
				{
					name: "Light",
					onClick: () => {
						(window as any).settings.appearance.theme = "light"
						store.saveSettings((window as any).settings)
					}
				},
				{
					name: "Dark",
					onClick: () => {
						(window as any).settings.appearance.theme = "dark"
						store.saveSettings((window as any).settings)
					}
				},
				{
					name: "OLED (beta)",
					onClick: () => {
						(window as any).settings.appearance.theme = "oled"
						store.saveSettings((window as any).settings)
					}
				}
			]} />
		</Item>
		<Item icon={icons.home} text={"Show Home button"} secondText={store.conf.appearance.showHomeButton ? "Enabled" : "Disabled"} multiline noHover>
			<Switch checked={store.conf.appearance.showHomeButton} click={onHomeButtonClick} />
		</Item>
		<Item icon={icons.compact} text={"New Tab settings"} />
	</Container>
))

