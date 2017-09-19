import React from 'react';
import '../assets/stylesheets/components/HomePage.scss';
import AmCharts from '@amcharts/amcharts3-react';
import { connect } from 'react-redux';
import { fetchStates } from '../actions/marketsActions';
import classnames from 'classnames';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.updateCustomMarkers = this.updateCustomMarkers.bind(this);
  }

  componentDidMount() {
    this.props.fetchStates().then(res => {
      this.setState({loading: false});
    }, err => {

    });
  }

  componentWillUnmount() {

  }

  updateCustomMarkers(event) {
    // get map object
    var map = event.chart;

    // go through all of the images
    for ( var x in map.dataProvider.images ) {
      // get MapImage object
      var image = map.dataProvider.images[ x ];

      // check if it has corresponding HTML element
      if ( 'undefined' == typeof image.externalElement )
        image.externalElement = this.createCustomMarker( image );

      // reposition the element accoridng to coordinates
      var xy = map.coordinatesToStageXY( image.longitude, image.latitude );
      image.externalElement.style.top = xy.y + 'px';
      image.externalElement.style.left = xy.x + 'px';
    }
  }

  // this function creates and returns a new marker element
  createCustomMarker(image) {
    // create holder
    var holder = document.createElement( 'div' );
    holder.className = 'map-marker';
    holder.title = image.title;
    holder.style.position = 'absolute';

    // maybe add a link to it?
    if ( undefined != image.url ) {
      holder.onclick = function() {
        window.location.href = image.url;
      };
      holder.className += ' map-clickable';
    }

    // create dot
    var dot = document.createElement( 'div' );
    dot.className = 'dot';
    holder.appendChild( dot );

    // create pulse
    var pulse = document.createElement( 'div' );
    pulse.className = 'pulse';
    holder.appendChild( pulse );

    // append the marker to the map container
    image.chart.chartDiv.appendChild( holder );

    return holder;
  }

  render() {
    const loading = (
      <div style={{height: '544px'}}>
        <div className="ui active centered loader"></div>
      </div>
    );

    const { states } = this.props;

    return (
      <div className="">
        {this.state.loading ? loading :
        <AmCharts.React
          className="map-marker"
          ref="ammap"
          style={{
            width: "100%",
            height: "500px"
          }}
          options={{
            "type": "map",
            "theme": "light",
            "imagesSettings": {
              "rollOverColor": "#089282",
              "rollOverScale": 3,
              "selectedScale": 3,
              "selectedColor": "#089282",
              "color": "#13564e"
            },
            "colorSteps": 10,
            "dataProvider": {
              "map": "usaLow",
              "areas": states,
              "images": [ {
                  "zoomLevel": 5,
                  "scale": 0.5,
                  "title": "Brussels",
                  "latitude": 42.2830786,
                  "longitude": -87.9531303
                },{
                  "zoomLevel": 5,
                  "scale": 0.5,
                  "title": "London",
                  "latitude": 41.8894661,
                  "longitude": -87.6288622,
                  "url": "http://www.google.co.uk"
                }
              ]
            },
            "listeners": [
              {
                "event": "positionChanged",
                "method": this.updateCustomMarkers
              }
            ],
            "areasSettings": {
              "autoZoom": true,
              "unlistedAreasColor": "#15A892"
            },
            "valueLegend": {
              "right": 10,
              "minValue": "little",
              "maxValue": "a lot!"
            },
            "export": {
              "enabled": true
            },
            "areasSettings": {
              "alpha": 1,
              "color": "#67B7DC",
              "colorSolid": "#003767",
              "rollOverOutlineColor": "none",
              "rollOverColor": "#637BE3",
              "selectedColor": "#F3735D",
              "autoZoom": true
            }
          }} /> }
      </div>
    );
  }
}

HomePage.propTypes = {
  states: React.PropTypes.array.isRequired,
  fetchStates: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    states: state.states
  }
}

export default connect(mapStateToProps, { fetchStates })(HomePage);
