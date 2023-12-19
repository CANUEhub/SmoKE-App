// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const markerLayer = {
  id: 'settlments',
  type: 'symbol',
  source:'settlements',
  'layout': {
    'icon-image': 'custom-marker',
    // get the title name from the source's "title" property
    'text-field': ['get', 'title'],
    'text-font': [
    'Open Sans Semibold',
    'Arial Unicode MS Bold'
    ],
    'text-offset': [0, 1.25],
    'text-anchor': 'top'
    }
};
