import * as React from 'react';
import {
  StyledSearchBox,
  SearchContainer,
  SearchIcon,
  Input,
  SecurityIcon,
  GOOGLE_ICON,
} from './style';
import store from '../../store';
import { callViewMethod } from '~/shared/utils/view';
import { ipcRenderer } from 'electron';
import { Suggestions } from '../Suggestions';
import { observer } from 'mobx-react';
import { icons } from '~/renderer/views/app/constants';

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    let suggestion = store.suggestions.selectedSuggestion

    if(suggestion) {
      if (suggestion.isSearch) {
        url = `https://duckduckgo.com/${url}`;
      } else if (url.indexOf('://') === -1) {
        url = `http://${url}`;
      }
    }

    callViewMethod(
      store.tabId,
      'webContents.loadURL',
      url,
    );

    setTimeout(() => {
      ipcRenderer.send(`hide-${store.id}`);
    });
  }
};

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  store.details.url = e.currentTarget.value;
}

export const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const key = e.keyCode;
  const { suggestions } = store;
  const { list } = suggestions;
  const input = store.inputRef.current;

  if (
    key !== 8 && // backspace
    key !== 13 && // enter
    key !== 17 && // ctrl
    key !== 18 && // alt
    key !== 16 && // shift
    key !== 9 && // tab
    key !== 20 && // capslock
    key !== 46 && // delete
    key !== 32 // space
  ) {
    store.canSuggest = true;
  } else {
    store.canSuggest = false;
  }

  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
    if (
      e.keyCode === 40 &&
      suggestions.selected + 1 <= list.length - 1 + store.history.length
    ) {
      suggestions.selected++;
    } else if (e.keyCode === 38 && suggestions.selected - 1 >= 0) {
      suggestions.selected--;
    }

    let suggestion = list.find(x => x.id === suggestions.selected);

    if (!suggestion) {
      suggestion = store.history.find(x => x.id === suggestions.selected);
    }

    if(suggestion) {
      input.value = suggestion.primaryText;
    }
  }
}

const onInput = () => {
  store.suggest()
}

@observer
export class Search extends React.Component {
  public props: any = {
    isFixed: false,
    style: '',
    visible: false
  };

  constructor(props: any) {
    super(props);
  }

  public state = {
    focused: false
  };

  render() {
    const { isFixed, style, visible } = this.props;

    const suggestionsVisible = store.suggestions.list.length !== 0;

    let height = 0;

    if (suggestionsVisible) {
      store.suggestions.list.forEach(() => {
        height += 38;
      })

      store.history.forEach(() => {
        height += 38;
      })

      if (store.suggestions.list.length > 0) {
        height += 30;
      }

      if (store.history.length > 0) {
        height += 30;
      }
    } else {
      height = 100;
    }

    ipcRenderer.send(`height-${store.id}`, height);

    return (
      <StyledSearchBox isFixed={isFixed} style={style} isFocused={true} visible={visible}>
        <SearchContainer>
          <SearchIcon 
            isFocused={store.details.url !== ""} 
            icon={
              store.details.url == "" 
                ? icons.search 
                : store.inputRef.current.value.length == 0 
                  ? store.details.favicon 
                  : GOOGLE_ICON
            }
          />
          <Input
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={onChange}
            defaultValue={store.details.url}
            placeholder={`Search or enter address`}
            onKeyDown={onKeyDown}
            onKeyPress={onKeyPress}
            onInput={onInput}
            suggestionsVisible={suggestionsVisible}
            ref={store.inputRef}
          />
        </SearchContainer>
        <Suggestions visible={suggestionsVisible} style={{ height: `${height}px` }}></Suggestions>
      </StyledSearchBox>
    );
  }
}
