import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import EmployeeForm from './components/EmployeeForm';
import { IEmployeeFormProps } from './components/IEmployeeFormProps';

export interface IEmployeeFormWebPartProps { }

export default class EmployeeFormWebPart extends BaseClientSideWebPart<IEmployeeFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEmployeeFormProps> = React.createElement(
      EmployeeForm,
      {
        spcontext: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
