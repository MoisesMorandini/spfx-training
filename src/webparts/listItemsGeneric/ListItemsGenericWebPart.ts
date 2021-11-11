import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ListItemsGenericWebPartStrings';
import ListItemsGeneric from './components/ListItemsGeneric';
import { IListItemsGenericProps } from './components/IListItemsGenericProps';

import { IListInfo, sp } from "@pnp/sp/presets/all";

export interface IListItemsGenericWebPartProps {
  sharepointListId: string;
}

export default class ListItemsGenericWebPart extends BaseClientSideWebPart<IListItemsGenericWebPartProps> {
  private paneOptionLists: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;

  public render(): void {
    const element: React.ReactElement<IListItemsGenericProps> = React.createElement(
      ListItemsGeneric,
      {
        sharepointListId: this.properties.sharepointListId,
        spcontext: this.context
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected async onInit() {
    await super.onInit();
    sp.setup({
      spfxContext: this.context
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    this.listsDropdownDisabled = true;
    var sharepointLists = await this.loadList();
    this.paneOptionLists = this.handleSharepointLists(sharepointLists);

    this.context.propertyPane.refresh();
    this.listsDropdownDisabled = false;
  }

  private async loadList(): Promise<IListInfo[]> {
    var list: IListInfo[] = await sp.web.lists.get();
    return list;
  }

  private handleSharepointLists(sharepointLists: IListInfo[]): IPropertyPaneDropdownOption[] {
    var lists: IPropertyPaneDropdownOption[] = [];
    sharepointLists.forEach((list: IListInfo) => {
      if (!list.Hidden && list.BaseTemplate === 100) {
        lists.push(
          {
            key: list.Id,
            text: list.Title,
          } as IPropertyPaneDropdownOption
        );
      }
    })
    return lists;
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneDropdown('sharepointListId', {
                  label: strings.DescriptionFieldLabel,
                  options: this.paneOptionLists,
                  disabled: this.listsDropdownDisabled
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
