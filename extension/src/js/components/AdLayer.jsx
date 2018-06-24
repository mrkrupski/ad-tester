import React from 'react';
import PropTypes from 'prop-types';

import CenteredLayer from './CenteredLayer';
import OutlinedText from './OutlinedText';
import AdEdit from './AdEdit';

const getElementDimensions = (element) => {
  const rect = element.getBoundingClientRect();

  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
};

const throttle = (timeout, fn) => {
  let lastCall = null;
  let previousReturn = null;

  return (...args) => {
    const call = !lastCall || Date.now() - lastCall >= timeout;

    if (call) {
      lastCall = Date.now();
      previousReturn = fn(...args);
    }

    return previousReturn;
  };
};

/**
 * Layer visible on ad, it updates position when user scrolls.
 * It should be displayed on top of page instead of local div
 * due to css and tag structure integrity
 *
 * @export
 */
export default class AdLayer extends React.PureComponent {
  static propTypes = {
    element: PropTypes.instanceOf(Element).isRequired,
  };

  constructor(props) {
    super(props);

    this.onScroll = throttle(200, this.onResize);
    this.state = {
      dimensions: getElementDimensions(props.element),
    };
  }

  componentDidMount() {
    document.addEventListener('resize', this.onResize);
    document.addEventListener('scroll', this.onScroll);

    setInterval(
      this.onResize,
      2000,
    );
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.onResize);
    document.removeEventListener('scroll', this.onScroll);
  }

  onResize = () => {
    this.setState({
      dimensions: getElementDimensions(this.props.element),
    });
  };

  render() {
    const {element, ...props} = this.props;
    const {dimensions} = this.state;
    if (dimensions.height * dimensions.width === 0)
      return null;

    return (
      <div
        {...props}
        style={{
          position: 'absolute',
          zIndex: 99999,
          background: 'rgba(255, 0, 0, 0.5)',
          border: '2px solid #FF0000',
          ...dimensions,
        }}
      >
        <CenteredLayer>
          <AdEdit
            titled={dimensions.width >= 150}
          />
          <OutlinedText
            style={{
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            {dimensions.height >= 120 && (
              <div style={{marginBottom: 7}}>
                {chrome.i18n.getMessage('ad_creation_dimensions')}
              </div>
            )}
            {`${Number.parseInt(dimensions.width, 10)}px : ${Number.parseInt(dimensions.height, 10)}px`}
          </OutlinedText>
        </CenteredLayer>
      </div>
    );
  }
}