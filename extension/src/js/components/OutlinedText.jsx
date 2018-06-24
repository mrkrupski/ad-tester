import React from 'react';

const OutlinedText = ({style, ...props}) => (
  <span
    {...props}
    style={{
      ...style,
      fontFamily: 'Verdana,sans-serif',
      color: '#fff',
      textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
    }}
  />
);

OutlinedText.displayName = 'OutlinedText';

export default OutlinedText;
