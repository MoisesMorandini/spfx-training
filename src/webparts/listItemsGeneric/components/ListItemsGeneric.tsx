import * as React from 'react';
import styles from './ListItemsGeneric.module.scss';
import { IListItemsGenericProps } from './IListItemsGenericProps';

import { sp } from '@pnp/sp';

interface FieldsName {
  Title: string;
  InternalName: string;
}

export default function ListItemsGeneric({ sharepointListId, spcontext }: IListItemsGenericProps) {
  const { useEffect, useState } = React;
  const [listName, setListName] = useState<string>('');
  const [listItems, setListItems] = useState<object[]>([]);
  const [listFields, setListFields] = useState<FieldsName[]>([]);

  useEffect(() => {
    async function getListData() {
      const listItems = await sp.web.lists.getById(sharepointListId).items.get();
      const listInfo = await sp.web.lists.getById(sharepointListId).get();
      const listFields: FieldsName[] = await sp.web.lists.getById(sharepointListId).fields.filter(
        "ReadOnlyField eq false and Hidden eq false and FieldTypeKind ne 12 and FieldTypeKind ne 19 and InternalName ne '_ExtendedDescription'"
      ).select('Title,InternalName').get();
      setListFields(listFields);
      setListItems(listItems);
      setListName(listInfo.Title);
    }

    getListData();
  }, [sharepointListId])

  return (
    <div className={styles.listItemsGeneric}>
      {
        !!sharepointListId ?
          (
            !!listName ?
              <h1>Lista: {listName}</h1> :
              <h1>Carregando</h1>
          ) : <h1>Selecione uma Lista</h1>
      }

      {
        !!listFields && !!listItems && !!listName ?
          (
            <table>
              <tr>
                {
                  listFields.map(field => { return <th>{field.Title}</th> })
                }
              </tr>

              {
                listItems.map(item => {
                  return (
                    <tr>
                      {
                        listFields.map(field => {
                          return <td> {item[field.InternalName]}</td>
                        })
                      }
                    </tr>
                  )
                })
              }
            </table>
          ) :
          <h1>ue</h1>

      }

    </div>
  );
}
