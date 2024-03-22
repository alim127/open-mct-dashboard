function getDictionary() {
    return http.get('/dictionary.json')
        .then(function (result) {
            return result.data;
        });
}

var objectProvider = {
    get: function (identifier) {
        return getDictionary().then(function (dictionary) {
            if (identifier.key === 'cube') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            }
            else {
                var measurement = dictionary.measurements.filter(function (m) {
                    
                    return m.key === identifier.key;
                    
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'cubesat.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'cubesat.taxonomy:cube'
                };
            }
        });
    }
};

var compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'cubesat.taxonomy' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getDictionary()
            .then(function (dictionary) {
                return dictionary.measurements.map(function (m) {
                    return {
                        namespace: 'cubesat.taxonomy',
                        key: m.key
                    };
                });
            });
    }
};

function DictionaryPlugin() {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'cubesat.taxonomy',
            key: 'cube'
        },openmct.priority.HIGH
        );
        
        openmct.objects.addProvider('cubesat.taxonomy', objectProvider);
        openmct.composition.addProvider(compositionProvider);

        openmct.types.addType('cubesat.telemetry', 
        {
            name: "Telemetry Point",
            description: "telemetry point",
            cssClass: 'icon-telemetry'
        });

    };
};