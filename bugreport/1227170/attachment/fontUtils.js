let fontsGenerated = 0;

function urlForFont(font) {
  const arrayBuffer = font.toArrayBuffer();
  const dataView = new DataView(arrayBuffer);
  const blob = new Blob([dataView], { type: "font/opentype" });
  return window.URL.createObjectURL(blob);
}

function fontFamilyFromFont(font) {
  const fontName = `customfont${fontsGenerated++}`;
  const styleElement = htmlToElement(`
        <style>
            @font-face {
              font-family: '${fontName}';
              src: url('${urlForFont(font)}') format('truetype');
            }
        </style>
    `);
  document.head.appendChild(styleElement);
  return fontName;
}

function fontWithIncreasinglyBigDigits() {
  const notdefGlyph = new opentype.Glyph({
    name: ".notdef",
    unicode: 0,
    advanceWidth: 1,
    path: new opentype.Path(),
  });
  const glyphs = [notdefGlyph];
  for (let i = 0; i < 10; i++) {
    const charCode = String(i).charCodeAt(0);
    const glyph = new opentype.Glyph({
      name: "bla",
      unicode: charCode,
      advanceWidth: 10 + i * 10,
      path: new opentype.Path(),
    });
    glyphs.push(glyph);
  }

  return new opentype.Font({
    familyName: "bla",
    styleName: "bla",
    unitsPerEm: 1000,
    ascender: 800,
    descender: -200,
    glyphs: glyphs,
  });
}

function fontWithLineHeight(height) {
  const notdefGlyph = new opentype.Glyph({
    name: ".notdef",
    unicode: 0,
    advanceWidth: 1,
    path: new opentype.Path(),
  });
  const glyphs = [notdefGlyph];
  for (let i = 0; i < 10; i++) {
    const charCode = String(i).charCodeAt(0);
    const glyph = new opentype.Glyph({
      name: "bla",
      unicode: charCode,
      advanceWidth: 1,
      path: new opentype.Path(),
    });
    glyphs.push(glyph);
  }

  return new opentype.Font({
    familyName: "bla",
    styleName: "bla",
    unitsPerEm: 1000,
    ascender: height,
    descender: -height,
    glyphs: glyphs,
  });
}

function createVariedHeightFontFamilyWithDifferentHeightsForDifferentDigits() {
  const fontName = `variedHeightFont`;
  let fontFacesCss = "";
  for (let i = 0; i < 10; i++) {
    fontFacesCss += `
      @font-face {
        font-family: '${fontName}';
        src: url('${urlForFont(
          fontWithLineHeight(1000 + i * 1000)
        )}') format('truetype');
        unicode-range: U+${String(i).charCodeAt(0).toString(16)};
      }
    `;
  }
  const styleElement = htmlToElement(`
      <style>
        ${fontFacesCss}
      </style>
  `);
  document.head.appendChild(styleElement);
  return fontName;
}
