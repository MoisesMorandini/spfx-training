import * as React from 'react';
import styles from './ListItemsGeneric.module.scss';
import { IListItemsGenericProps } from './IListItemsGenericProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class ListItemsGeneric extends React.Component<IListItemsGenericProps, {}> {
  public render(): React.ReactElement<IListItemsGenericProps> {
    return (
      <div className={styles.listItemsGeneric}>
        <h1>Hello World</h1>
      </div>
    );
  }
}
