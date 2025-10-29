'use client'; // If using in a client component in Next.js App Router

import React, { useState } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css'; // Import the CSS for the color picker

function MyColorPickerComponent() {
  const [color, setColor] = useColor('hex', '#121212'); // Initialize with a default color

  return (
    <div>
      <h1>Color Picker Example</h1>
      <ColorPicker width={456} height={228} color={color} onChange={setColor} hideRGB hideHSV />
      <div>Selected Color: {color.hex}</div>
    </div>
  );
}

export default MyColorPickerComponent;