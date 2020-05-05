import React from 'react';
import ReactDOM from 'react-dom';
import {Voyager} from 'graphql-voyager';

import * as serviceWorker from './serviceWorker';
import * as constants  from './constants';

function introspectionProvider() {
    return new Promise(async (resolve, reject) => {
        const introspection = await fetch(`${process.env.REACT_APP_BACKEND_URL}/graphql`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: constants.introspectionQuery }),
        }).then(response => response.json());
        introspection.data.__schema.types[0].fields = introspection.data.__schema.types[0].fields.filter(field => field.name === 'self');
        introspection.data.__schema.types = introspection.data.__schema.types.map(type => {
            if(type.name === 'UploadFile') {
                type.fields = type.fields.filter(field => field.name !== 'related')
            }
            return type
        });
        let introspectionString = JSON.stringify(introspection);
        introspectionString = introspectionString.replace(/UsersPermissionsUser/g,"User");
        return resolve(JSON.parse(introspectionString))
    });
}

ReactDOM.render(
    <Voyager
        introspection={introspectionProvider}
        workerURI={process.env.PUBLIC_URL + '/voyager.worker.js'}
    />, document.getElementById('voyager'), document.getElementById('root')
);

serviceWorker.unregister();
